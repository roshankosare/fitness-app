import { prisma } from "../util/db";
import { UnauthorizedError } from "../errors";

type CreateWorkoutInput = {
  exercise: string;
  image?: string;
};

export const createWorkout = async (
  adminId: string,
  data: CreateWorkoutInput
) => {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new UnauthorizedError();

  const workout = await prisma.workout.create({
    data: {
      createdById: adminId,
      ...data,
    },
  });

  return workout;
};

export const getAllWorkouts = async () => {
  return await prisma.workout.findMany({
    include: {
      createdBy: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getWorkoutById = async (id: string) => {
  return await prisma.workout.findUnique({
    where: { id },
    include: {
      createdBy: { select: { fullName: true, email: true } },
    },
  });
};

export const updateWorkout = async (
  id: string,
  data: Partial<CreateWorkoutInput>
) => {
  return await prisma.workout.update({
    where: { id },
    data,
  });
};

export const deleteWorkout = async (id: string) => {
  return await prisma.workout.delete({
    where: { id },
  });
};

export const getWorkoutsByAdmin = async (adminId: string) => {
  return await prisma.workout.findMany({
    where: { createdById: adminId },
    orderBy: { date: "desc" },
  });
};
