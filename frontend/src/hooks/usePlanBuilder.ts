import { type Plan, type PlanWeek } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type Exercise = {
  name: string;
  sets: string;
  reps: string;
};

type WeekDay = {
  day: DayName;
  workoutName?: string;
  exercises: Exercise[]; // used for exercise search UI
};

const mockFetchExercises = async (query: string) => {
  const all = [
    "Bench Press",
    "Squats",
    "Deadlift",
    "Pull Ups",
    "Push Ups",
    "Lunges",
    "Plank",
  ];
  return all.filter((e) => e.toLowerCase().includes(query.toLowerCase()));
};

export const usePlanBuilder = (planId: string | null | undefined) => {
  const [plan, setPlan] = useState<(Plan & { weeks: PlanWeek[] }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weeks, setWeeks] = useState<
    (Pick<PlanWeek, "id"> & { days: WeekDay[] })[]
  >([]);
  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (!planId) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/admin/plans/${planId}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const planData = res.data.data as Plan & { weeks: PlanWeek[] };
          setPlan(planData);

          const planWeeks = planData.weeks.map((week: PlanWeek) => {
            const activities = (week.activities || {}) as {
              id: string;
              days: WeekDay[];
            };

            return {
              ...week,
              days: (
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ] as DayName[]
              ).map((day) => {
                const activityDay = activities.days?.find((d) => d.day === day);

                return {
                  day,
                  workoutName: activityDay?.workoutName || "",
                  exercises: activityDay?.exercises || [],
                };
              }),
            };
          });

          setWeeks(planWeeks);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [navigate, planId]);

  const searchExercise = async (value: string) => {
    const data = await mockFetchExercises(value);
    setExerciseList(data);
  };

  /** ➕ Add a new week */
  const addWeek = () => {
    if (weeks.length >= 4) {
      alert("Maximum 4 weeks allowed!");
      return;
    }

    const newWeek: Pick<PlanWeek, "id"> & { days: WeekDay[] } = {
      id: Date.now().toString(),
      days: (
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ] as DayName[]
      ).map((day) => ({
        day,
        workoutName: "",
        exercises: [],
        searchResults: [],
      })),
    };

    setWeeks((prev) => [...prev, newWeek]);
  };

  /** 🧠 Generic day change handler */
  const handleDayChange = async (
    weekIndex: number,
    dayIndex: number,
    field: string,
    value: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];

    // Handle nested exercise field (e.g. exercises.0.name)
    if (field.startsWith("exercises.")) {
      const parts = field.split(".");
      const exIndex = parseInt(parts[1]);
      const exField = parts[2] as keyof Exercise;

      day.exercises[exIndex] = {
        ...day.exercises[exIndex],
        [exField]: value,
      };
    } else if (field === "workoutName") {
      day.workoutName = value;
    }
    newWeeks[weekIndex].days[dayIndex] = day;
    setWeeks(newWeeks);
  };

  /** 🧩 Add a new exercise to a day */
  const addExercise = (weekIndex: number, dayIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].exercises.push({
      name: "",
      sets: "",
      reps: "",
    });
    setWeeks(newWeeks);
  };

  /** ✅ Select an exercise from search results */
  const selectExercise = (
    weekIndex: number,
    dayIndex: number,
    name: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];

    if (day.exercises.length === 0) {
      day.exercises.push({ name, sets: "", reps: "" });
    } else {
      const last = day.exercises.length - 1;
      day.exercises[last].name = name;
    }

    setExerciseList([]);
    setWeeks(newWeeks);
  };

  /** 💾 Save plan (can later POST to backend) */
  const savePlan = async (weekIndex: number) => {
    console.log("Saving plan:", { planId, weeks });

    try {
      const res = await axios.post(
        `http://localhost:4000/api/admin/plans/${planId}/weeks`,
        { activities: weeks[weekIndex], weekNumber: weekIndex + 1 },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Weekly plan saved successfully!");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save plan");
    }
  };

  return {
    plan,
    weeks,
    selectExercise,
    savePlan,
    handleDayChange,
    addWeek,
    addExercise,
    loading,
    searchExercise,
    exerciseList,
  };
};
