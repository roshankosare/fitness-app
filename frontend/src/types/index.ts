export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Exercise = {
  name: string;
  sets: string;
  reps: string;
};

export type WeekDay = {
  day: DayName;
  workoutName?: string;
  exercises: Exercise[]; // used for exercise search UI
};

export interface UserProgress {
  current?: {
    weekNumber: number;
    day: string;
    exercise?: string;
    startedAt?: string;
  };
  weeks: {
    weekNumber: number;
    days: {
      day: string;
      workoutName: string;
      completed: boolean;
      exercises: {
        name: string;
        sets: string;
        reps: string;
        completed: boolean;
      }[];
    }[];
  }[];
}
