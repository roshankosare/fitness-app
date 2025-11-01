import { ValidationError } from "../errors";

interface WorkoutProps {
  exercise: string;
  date?: string;
  image?: string;
}

export const createWorkoutValidation = (props: WorkoutProps) => {
  const { exercise, image } = props;

  if (!exercise) throw new ValidationError("Exercise name is required");

  if (exercise.length < 3)
    throw new ValidationError("Exercise name must be at least 3 characters long");


  if (image && !/^https?:\/\/.+\..+/.test(image))
    throw new ValidationError("Invalid image URL");
};
