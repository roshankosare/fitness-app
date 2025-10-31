import { prisma } from "../../src/util/db";
import { ValidationError } from "../../src/errors";
import { getAllWorkoutsPlans, getWorkoutById } from "../../src/services";

jest.mock("../../src/util/db", () => ({
  prisma: {
    plan: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("Workout Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllWorkoutsPlans", () => {
    it("should return a list of workout plans", async () => {
      const mockPlans = [
        { id: "1", createdBy: { fullName: "John Doe" } },
        { id: "2", createdBy: { fullName: "Jane Doe" } },
      ];
      (prisma.plan.findMany as jest.Mock).mockResolvedValue(mockPlans);

      const result = await getAllWorkoutsPlans();

      expect(prisma.plan.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPlans);
    });
  });

  describe("getWorkoutById", () => {
    it("should return a workout plan if found", async () => {
      const mockPlan = {
        id: "1",
        createdBy: { fullName: "John Doe" },
        weeks: [],
      };
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue(mockPlan);

      const result = await getWorkoutById("1");

      expect(prisma.plan.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: { createdBy: { select: { fullName: true } }, weeks: true },
      });
      expect(result).toEqual(mockPlan);
    });

    it("should throw ValidationError if not found", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getWorkoutById("999")).rejects.toThrow(ValidationError);
    });
  });
});
