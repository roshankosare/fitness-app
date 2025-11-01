import { Prisma } from "@prisma/client";
import { prisma } from "../util/db";
import { UnauthorizedError, ValidationError } from "../errors";

/**

* ─────────────────────────────────────────────────────────────
* Admin Profile Services
* ─────────────────────────────────────────────────────────────
  */

export const getAdminProfile = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      userProfile: true,
      createdAt: true,
    },
  });

  if (!admin) throw new ValidationError("Admin not found");

  return admin;
};

export const updateAdminProfile = async (
  adminId: string,
  data: Partial<{ fullName: string; email: string }>
) => {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new ValidationError("Admin not found");

  const updated = await prisma.user.update({
    where: { id: adminId },
    data,
  });

  return updated;
};

/**

* ─────────────────────────────────────────────────────────────
* Plan Management Services
* ─────────────────────────────────────────────────────────────
  */

type CreatePlanInput = Pick<
  Prisma.PlanCreateInput,
  "name" | "description" | "bannerImage"
>;

export const createPlan = async (adminId: string, data: CreatePlanInput) => {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new UnauthorizedError();

  const plan = await prisma.plan.create({
    data: {
      createdById: adminId,
      ...data,
    },
  });

  return plan;
};

export const getAllPlans = async (adminId: string) => {
  return prisma.plan.findMany({
    where: {
      createdById: adminId,
    },
    include: {
      createdBy: { select: { fullName: true, email: true } },
      weeks: true,
      selectedBy: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPlanById = async (planId: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      weeks: true,
      createdBy: { select: { fullName: true, email: true } },
    },
  });

  if (!plan) throw new ValidationError("Plan not found");
  return plan;
};

export const updatePlan = async (
  adminId: string,
  planId: string,
  data: Partial<
    Pick<Prisma.PlanUpdateInput, "name" | "description" | "bannerImage">
  >
) => {
  const plan = await prisma.plan.findUnique({
    where: { createdById: adminId, id: planId },
  });
  if (!plan) throw new ValidationError("Plan not found");

  const updateData: Prisma.PlanUpdateInput = {
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.bannerImage != null && { bannerImage: data.bannerImage }), // ✅ only if not null/undefined
  };

  const updatedPlan = await prisma.plan.update({
    where: { id: planId },
    data: updateData,
  });

  return updatedPlan;
};

/**

* Safe delete — retains user progress by archiving the plan instead of hard delete
  */
export const deletePlan = async (adminId: string, planId: string) => {
  const plan = await prisma.plan.findUnique({
    where: { createdById: adminId, id: planId },
  });
  if (!plan) throw new ValidationError("Plan not found");

  // If users have subscribed, mark it inactive instead of deleting
  const hasSubscribers = await prisma.userPlan.findFirst({
    where: { planId },
  });

  if (hasSubscribers) {
    // Soft delete (archive)
    const archived = await prisma.plan.update({
      where: { id: planId },
      data: {
        name: plan.name + " (Archived)",
        active: false,
      },
    });
    return { archived, message: "Plan archived since users have progress" };
  }

  //   await prisma.planWeek.deleteMany({ where: { planId } });
  //   await prisma.plan.delete({ where: { id: planId } });

  return { message: "Plan deleted successfully" };
};

/**

* ─────────────────────────────────────────────────────────────
* Plan Week Management
* ─────────────────────────────────────────────────────────────
  */

export const addOrUpdatePlanWeek = async (
  adminId: string,
  planId: string,
  weekNumber: number,
  activities: any
) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new ValidationError("Plan not found");

  if (plan.createdById !== adminId) throw new UnauthorizedError();

  const week = await prisma.planWeek.upsert({
    where: {
      planId_weekNumber: { planId, weekNumber },
    },
    update: { activities },
    create: { planId, weekNumber, activities },
  });

  return week;
};

export const deletePlanWeek = async (
  adminId: string,
  planId: string,
  weekId: string
) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new ValidationError("Plan not found");

  if (plan.createdById !== adminId) throw new UnauthorizedError();
  const week = await prisma.planWeek.findUnique({
    where: { id: weekId, planId: planId },
  });
  if (!week) throw new ValidationError("Week not found");
  if (week.planId !== plan.id) throw new UnauthorizedError();

  await prisma.planWeek.delete({ where: { id: weekId } });
  return { message: "Week deleted successfully" };
};
