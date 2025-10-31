import { UserProfile } from "@prisma/client";
import { prisma } from "../util/db";
import { ValidationError } from "../errors";

// ----------------------------
// 📘 Get User Profile
// ----------------------------
export const getUserProfile = async (id: string) => {
  const userProfile = await prisma.user.findUnique({
    where: { id },
    select: {
      fullName: true,
      email: true,
      role: true,
      userProfile: {
        select: {
          age: true,
          heightCm: true,
          weightKg: true,
          goal: true,
          activity: true,
        },
      },
    },
  });

  if (!userProfile) throw new ValidationError("Invalid user ID");

  return userProfile;
};

// ----------------------------
// ✏️ Update User Profile
// ----------------------------
export const updateUserProfile = async (
  id: string,
  data: Partial<Pick<UserProfile, "weightKg" | "age" | "activity" | "goal" | "heightCm">>
) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { userProfile: true },
  });

  if (!user) throw new ValidationError("User not found");


  // Otherwise, update existing profile
  const updatedProfile = await prisma.userProfile.update({
    where: { userId: user.id },
    data,
  });

  return updatedProfile;
};

// ----------------------------
// 🏋️ Subscribe to a Workout Plan
// ----------------------------
export const subscribeWorkoutPlan = async (
  userId: string,
  planId: string
) => {
  // Validate user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ValidationError("User not found");

  // Validate plan
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new ValidationError("Workout plan not found");

  // Check if already subscribed
  const existingSubscription = await prisma.userPlan.findUnique({
    where: { userId_planId: { userId, planId } },
  });

  if (existingSubscription)
    throw new ValidationError("User already subscribed to this plan");

  // Create subscription
  const subscription = await prisma.userPlan.create({
    data: {
      userId,
      planId,
      startDate: new Date(),
    },
  });

  return subscription;
};

// ----------------------------
// ❌ Withdraw (Unsubscribe) from a Workout Plan
// ----------------------------
export const withdrawWorkoutPlan = async (
  userId: string,
  planId: string
) => {
  // Validate user and plan exist
  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.plan.findUnique({ where: { id: planId } }),
  ]);

  if (!user) throw new ValidationError("User not found");
  if (!plan) throw new ValidationError("Workout plan not found");

  // Check if subscription exists
  const existingSubscription = await prisma.userPlan.findUnique({
    where: { userId_planId: { userId, planId } },
  });

  if (!existingSubscription)
    throw new ValidationError("User is not subscribed to this plan");

  // Delete the subscription
  await prisma.userPlan.delete({
    where: { userId_planId: { userId, planId } },
  });

  return { message: "Successfully unsubscribed from the plan" };
};
