import type { Plan, PlanWeek } from "@prisma/client";
import { createContext } from "react";
import type { WeekDay } from "../types";

interface PlanBuilderContextValue {
  plan: (Plan & { weeks: PlanWeek[] }) | null;
  weeks: (Pick<PlanWeek, "id"> & { days: WeekDay[] })[];
  loading: boolean;
  addWeek: () => void;
  addExercise: (weekIndex: number, dayIndex: number) => void;
  handleDayChange: (
    weekIndex: number,
    dayIndex: number,
    field: string,
    value: string
  ) => void;
  selectExercise: (
    weekIndex: number,
    dayIndex: number,
    name: string
  ) => void;
  savePlan: (weekIndex: number) => Promise<void>;
}

// 🔹 Create Context
export const PlanBuilderContext = createContext<PlanBuilderContextValue | undefined>(
  undefined
);
