import { ValidationError } from "../errors";
import { prisma } from "../util/db";

export const getAllWorkoutsPlans = async () => {
  const plans = await prisma.plan.findMany({
    include: {
      createdBy: {
        select: {
          fullName: true,
        },
      },
    },
  });
  return plans;
};

export const getWorkoutPlanById = async (id: string) => {
  const plan = await prisma.plan.findUnique({
    where: {
      id: id,
    },
    include: {
      createdBy: {
        select: {
          fullName: true,
        },
      },
      weeks: true,
    },
  });
  

  if (!plan) throw new ValidationError("invalid workout id");

  return plan;
};
