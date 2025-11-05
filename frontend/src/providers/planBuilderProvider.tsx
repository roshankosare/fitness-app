import { useEffect, useState, type ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import type { Plan, PlanWeek } from "@prisma/client";
import type { WeekDay, Exercise, DayName } from "../types";
import { PlanBuilderContext } from "../context/planBuilderContext";

// 🔹 Context value type

// 🔹 Provider Component
export const PlanBuilderProvider = ({
  children,
  planId,
}: {
  children: ReactNode;
  planId: string | null | undefined;
}) => {
  const [plan, setPlan] = useState<(Plan & { weeks: PlanWeek[] }) | null>(null);
  const [weeks, setWeeks] = useState<
    (Pick<PlanWeek, "id"> & { days: WeekDay[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch Plan
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
          console.log(res.data.data);
          const planData = res.data.data as Plan & { weeks: PlanWeek[] };
          setPlan(planData);

          const planWeeks = planData.weeks.map((week: PlanWeek) => {
            const activities = (week.activities || {}) as WeekDay[];

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
                const activityDay = activities?.find((d) => d.day === day);

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

  /** ➕ Add exercise */
  const addExercise = (weekIndex: number, dayIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].days[dayIndex].exercises.push({
      name: "",
      sets: "",
      reps: "",
    });
    setWeeks(newWeeks);
  };

  /** ✅ Select exercise */
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

    setWeeks(newWeeks);
  };

  /** 💾 Save plan */
  const savePlan = async (weekIndex: number) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/admin/plans/${planId}/weeks`,
        { activities: weeks[weekIndex].days, weekNumber: weekIndex + 1 },
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

  return (
    <PlanBuilderContext.Provider
      value={{
        plan,
        weeks,
        loading,
        addWeek,
        addExercise,
        handleDayChange,
        selectExercise,
        savePlan,
      }}
    >
      {children}
    </PlanBuilderContext.Provider>
  );
};

// 🔹 Hook to use context easily
