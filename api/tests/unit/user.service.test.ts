import { prisma } from "../../src/util/db";
import {
  getUserProfile,
  updateUserProfile,
  subscribeWorkoutPlan,
  withdrawWorkoutPlan,
} from "../../src/services/user.service";
import { ValidationError } from "../../src/errors";

// Mock Prisma client
jest.mock("../../src/util/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
      update: jest.fn(),
    },
    plan: {
      findUnique: jest.fn(),
    },
    userPlan: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------
  // getUserProfile()
  // ----------------------------
  describe("getUserProfile", () => {
    it("should return user profile if found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        fullName: "John Doe",
        email: "john@example.com",
        role: "USER",
        userProfile: {
          age: 25,
          heightCm: 175,
          weightKg: 70,
          goal: "Build muscle",
          activity: "Active",
        },
      });

      const result = await getUserProfile("user-123");
      expect(result.email).toBe("john@example.com");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: expect.any(Object),
      });
    });

    it("should throw ValidationError if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getUserProfile("invalid")).rejects.toThrow(ValidationError);
    });
  });

  //   // ----------------------------
  //   // updateUserProfile()
  //   // ----------------------------
  describe("updateUserProfile", () => {
    it("should update an existing profile", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-1",
        userProfile: { userId: "user-1" },
      });
      (prisma.userProfile.update as jest.Mock).mockResolvedValue({
        userId: "user-1",
        goal: "Lose weight",
      });

      const result = await updateUserProfile("user-1", { goal: "Lose weight" });
      expect(result.goal).toBe("Lose weight");
      expect(prisma.userProfile.update).toHaveBeenCalled();
    });

    it("should throw ValidationError if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(updateUserProfile("x", {})).rejects.toThrow(ValidationError);
    });
  });

  //   // ----------------------------
  //   // subscribeWorkoutPlan()
  //   // ----------------------------
    describe("subscribeWorkoutPlan", () => {
      it("should create a subscription successfully", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" }); // user
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce({ id: "p1" }); // plan
        (prisma.userPlan.findUnique as jest.Mock).mockResolvedValueOnce(null); // not subscribed
        (prisma.userPlan.create as jest.Mock).mockResolvedValueOnce({
          userId: "u1",
          planId: "p1",
        });

        const result = await subscribeWorkoutPlan("u1", "p1");
        expect(result).toEqual({ userId: "u1", planId: "p1" });
        expect(prisma.userPlan.create).toHaveBeenCalled();
      });

      it("should throw if user not found", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
        await expect(subscribeWorkoutPlan("x", "p1")).rejects.toThrow(
          "User not found"
        );
      });

      it("should throw if plan not found", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(subscribeWorkoutPlan("u1", "x")).rejects.toThrow(
          "Workout plan not found"
        );
      });

      it("should throw if already subscribed", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce({ id: "p1" });
        (prisma.userPlan.findUnique as jest.Mock).mockResolvedValueOnce({
          userId: "u1",
          planId: "p1",
        });

        await expect(subscribeWorkoutPlan("u1", "p1")).rejects.toThrow(
          "User already subscribed"
        );
      });
    });

  //   // ----------------------------
  //   // withdrawWorkoutPlan()
  //   // ----------------------------
    describe("withdrawWorkoutPlan", () => {
      it("should delete a subscription if exists", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce({ id: "p1" });
        (prisma.userPlan.findUnique as jest.Mock).mockResolvedValueOnce({
          userId: "u1",
          planId: "p1",
        });
        (prisma.userPlan.delete as jest.Mock).mockResolvedValueOnce({});

        const result = await withdrawWorkoutPlan("u1", "p1");
        expect(result.message).toBe("Successfully unsubscribed from the plan");
        expect(prisma.userPlan.delete).toHaveBeenCalled();
      });

      it("should throw if user not found", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
        await expect(withdrawWorkoutPlan("x", "p1")).rejects.toThrow(
          "User not found"
        );
      });

      it("should throw if plan not found", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(withdrawWorkoutPlan("u1", "x")).rejects.toThrow(
          "Workout plan not found"
        );
      });

      it("should throw if not subscribed", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
        (prisma.plan.findUnique as jest.Mock).mockResolvedValueOnce({ id: "p1" });
        (prisma.userPlan.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(withdrawWorkoutPlan("u1", "p1")).rejects.toThrow(
          "User is not subscribed"
        );
      });
    });
});
