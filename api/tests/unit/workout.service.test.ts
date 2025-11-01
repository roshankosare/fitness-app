import { createWorkout } from "../../src/services/workout.service";
import { prisma } from "../../src/util/db";
import { UnauthorizedError } from "../../src/errors";

jest.mock("../../src/util/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    workout: {
      create: jest.fn(),
    },
  },
}));

describe("Workout Service", () => {
  const mockUser = { id: "user123" };
  const mockWorkout = {
    id: "workout123",
    exercise: "Push Ups",
    createdById: "user123",
  };

  it("should create a workout if user exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.workout.create as jest.Mock).mockResolvedValue(mockWorkout);

    const result = await createWorkout("user123", {
      exercise: "Push Ups",
    });

    expect(result).toEqual(mockWorkout);
    expect(prisma.workout.create).toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      createWorkout("invalid", {
        exercise: "Push Ups",
      })
    ).rejects.toThrow(UnauthorizedError);
  });
});
