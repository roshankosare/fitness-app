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
