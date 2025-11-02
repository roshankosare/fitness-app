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

type WeekDay = {
  day: DayName;
  exercise: string;
  sets: string;
  reps: string;
  searchResults: string[];
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
  console.log(planId);
  const [plan, setPlan] = useState<(Plan & { weeks: PlanWeek }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weeks, setWeeks] = useState<
    (Pick<PlanWeek, "id"> & { days: WeekDay[] })[]
  >([]);
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
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setPlan(res.data.data);
          setWeeks(res.data.data.weeks);
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

  // get plan id from route

  const addWeek = () => {
    if (weeks.length >= 4) {
      alert("Maximum 4 weeks allowed!");
      return;
    }

    const newWeek: Pick<PlanWeek, "id"> & { days: WeekDay[] } = {
      id: Date.now().toString(),
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => ({
        day: day as DayName,
        exercise: "",
        sets: "",
        reps: "",
        searchResults: [],
      })),
    };

    setWeeks((prev) => [...prev, newWeek]);
  };

  const handleDayChange = async (
    weekIndex: number,
    dayIndex: number,
    field: string,
    value: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];

    if (field === "exercise") {
      day.exercise = value;
      if (value.trim().length > 0) {
        day.searchResults = await mockFetchExercises(value);
      } else {
        day.searchResults = [];
      }
    }

    setWeeks(newWeeks);
  };

  const selectExercise = (
    weekIndex: number,
    dayIndex: number,
    name: string
  ) => {
    const newWeeks = [...weeks];
    const day = newWeeks[weekIndex].days[dayIndex];
    day.exercise = name;
    day.searchResults = [];
    setWeeks(newWeeks);
  };

  const savePlan = () => {
    console.log("Saving plan:", { planId, weeks });
    alert("Weekly plan saved (check console for output)");
  };

  return {
    plan,
    weeks,
    selectExercise,
    savePlan,
    handleDayChange,
    addWeek,
    loading,
  };
};
