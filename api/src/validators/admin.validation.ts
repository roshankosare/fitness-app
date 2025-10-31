import { ValidationError } from "../errors";

/**

* ─────────────────────────────────────────────────────────────
* 🧑‍💼 Admin Profile Validations
* ─────────────────────────────────────────────────────────────
  */
type UpdateAdminProfileProps = {
  fullName?: string;
  email?: string;
  password?: string;
};

export const updateAdminProfileValidation = (
  props: UpdateAdminProfileProps
) => {
  const { fullName, email, password } = props;

  if (!fullName && !email && !password)
    throw new ValidationError("At least one field is required to update");

  if (email && !/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email))
    throw new ValidationError("Invalid email format");

  if (password && password.length < 8)
    throw new ValidationError("Password must be at least 8 characters long");
};

/**

* ─────────────────────────────────────────────────────────────
* 🏋️ Plan Validations
* ─────────────────────────────────────────────────────────────
  */
type PlanProps = {
  name: string;
  description: string;
};

export const createPlanValidation = (props: PlanProps) => {
  const { name, description } = props;

  if (!name || !description)
    throw new ValidationError("Name and description are required");

  if (name.length < 3)
    throw new ValidationError("Plan name must be at least 3 characters long");

  if (description.length < 10)
    throw new ValidationError(
      "Description must be at least 10 characters long"
    );
};

export const updatePlanValidation = (props: Partial<PlanProps>) => {
  const { name, description } = props;

  if (!name && !description)
    throw new ValidationError("At least one field is required to update");

  if (name && name.length < 3)
    throw new ValidationError("Plan name must be at least 3 characters long");

  if (description && description.length < 10)
    throw new ValidationError(
      "Description must be at least 10 characters long"
    );
};

/**

* ─────────────────────────────────────────────────────────────
* 📅 Plan Week Validations
* ─────────────────────────────────────────────────────────────
  */
type Activity = {
  exercise: string;
  sets: number;
  reps: number;
};

type PlanWeekProps = {
  weekNumber: number;
  activities: Record<string, Activity[]>;
};

export const addOrUpdatePlanWeekValidation = (props: PlanWeekProps) => {
  const { weekNumber, activities } = props;

  if (!weekNumber || weekNumber < 1)
    throw new ValidationError("Week number must be at least 1");

  if (!activities || typeof activities !== "object")
    throw new ValidationError("Activities must be a valid object");

  const days = Object.keys(activities);
  if (days.length === 0)
    throw new ValidationError("At least one day of activities is required");

  for (const day of days) {
    const dayActivities = activities[day];
    if (!Array.isArray(dayActivities) || dayActivities.length === 0)
      throw new ValidationError(`No activities found for ${day}`);

    for (const act of dayActivities) {
      if (!act.exercise)
        throw new ValidationError(`Exercise name missing for ${day}`);
      if (!act.sets || act.sets < 1)
        throw new ValidationError(`Invalid sets count for ${act.exercise}`);
      if (!act.reps || act.reps < 1)
        throw new ValidationError(`Invalid reps count for ${act.exercise}`);
    }
  }
};
