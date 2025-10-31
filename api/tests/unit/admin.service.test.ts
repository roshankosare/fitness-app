import {
  getAdminProfile,
  updateAdminProfile,
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  addOrUpdatePlanWeek,
  deletePlanWeek,
} from "../../src/services";
import { prisma } from "../../src/util/db";
import { UnauthorizedError, ValidationError } from "../../src/errors";

jest.mock("../../src/util/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    plan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    planWeek: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    userPlan: {
      findFirst: jest.fn(),
    },
  },
}));

describe("Admin Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminProfile", () => {
    it("should return admin profile", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "admin1",
        fullName: "Admin",
        email: "admin@test.com",
      });

      const result = await getAdminProfile("admin1");
      expect(result.email).toBe("admin@test.com");
    });

    it("should throw error if not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(getAdminProfile("x")).rejects.toThrow(ValidationError);
    });
  });

  describe("updateAdminProfile", () => {
    it("should update profile", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "admin1" });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: "admin1",
        fullName: "New",
      });

      const result = await updateAdminProfile("admin1", { fullName: "New" });
      expect(result.fullName).toBe("New");
    });
  });

  describe("createPlan", () => {
    it("should create plan successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "admin1" });
      (prisma.plan.create as jest.Mock).mockResolvedValue({ id: "plan1" });

      const result = await createPlan("admin1", {
        name: "Test",
        description: "Desc",
      });
      expect(result.id).toBe("plan1");
    });

    it("should throw unauthorized if admin not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        createPlan("admin1", { name: "X", description: "Y" })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("getAllPlans", () => {
    it("should fetch all plans", async () => {
      (prisma.plan.findMany as jest.Mock).mockResolvedValue([{ id: "plan1" }]);
      const result = await getAllPlans("admin1");
      expect(result).toHaveLength(1);
    });
  });

  describe("getPlanById", () => {
    it("should return plan by id", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue({ id: "plan1" });
      const result = await getPlanById("plan1");
      expect(result.id).toBe("plan1");
    });

    it("should throw if not found", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(getPlanById("x")).rejects.toThrow(ValidationError);
    });
  });

  describe("updatePlan", () => {
    it("should update plan", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue({ id: "plan1" });
      (prisma.plan.update as jest.Mock).mockResolvedValue({
        id: "plan1",
        name: "Updated",
      });

      const result = await updatePlan("admin1", "plan1", { name: "Updated" });
      expect(result.name).toBe("Updated");
    });
  });

  describe("deletePlan", () => {
    it("should archive if subscribers exist", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue({
        id: "plan1",
        name: "Plan",
        createdById: "admin1",
      });
      (prisma.userPlan.findFirst as jest.Mock).mockResolvedValue({
        id: "sub1",
      });
      (prisma.plan.update as jest.Mock).mockResolvedValue({
        id: "plan1",
        active: false,
      });

      const result = await deletePlan("admin1", "plan1");
      expect(result.message).toMatch(/archived/);
    });
  });

  describe("addOrUpdatePlanWeek", () => {
    it("should upsert plan week", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue({
        id: "plan1",
        createdById: "admin1",
      });
      (prisma.planWeek.upsert as jest.Mock).mockResolvedValue({ id: "week1" });

      const result = await addOrUpdatePlanWeek("admin1", "plan1", 1, {});
      expect(result.id).toBe("week1");
    });
  });

  describe("deletePlanWeek", () => {
    it("should delete week successfully", async () => {
      (prisma.plan.findUnique as jest.Mock).mockResolvedValue({
        id: "plan1",
        createdById: "admin1",
      });
      (prisma.planWeek.findUnique as jest.Mock).mockResolvedValue({
        id: "week1",
        planId: "plan1",
      });

      const result = await deletePlanWeek("admin1", "plan1", "week1");
      expect(result.message).toBe("Week deleted successfully");
    });
  });
});
