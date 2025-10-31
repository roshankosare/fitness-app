import { Request, Response, NextFunction } from "express";
import {
  getUserProfile,
  updateUserProfile,
  subscribeWorkoutPlan,
  withdrawWorkoutPlan,
} from "../services/user.service";

/**

* @desc Get user profile by ID
* @route GET /api/user/:id
  */
export const getUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req as any).user.id;
    const user = await getUserProfile(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**

* @desc Update user profile (age, weight, goal, etc.)
* @route PUT /api/user/:id
  */
export const updateUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req as any).user.id;
    const body = req.body;

    const updated = await updateUserProfile(id, body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**

* @desc Subscribe user to a workout plan
* @route POST /api/user/:userId/subscribe/:planId
  */
export const subscribeWorkoutPlanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req as any).user.id;
    const { planId } = req.params;

    const subscription = await subscribeWorkoutPlan(id, planId);

    res.status(201).json({
      success: true,
      message: "Subscribed to workout plan successfully",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
};

/**

* @desc Withdraw user from a workout plan
* @route DELETE /api/user/:userId/withdraw/:planId
  */
export const withdrawWorkoutPlanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req as any).user.id;
    const { planId } = req.params;

    const withdrawal = await withdrawWorkoutPlan(id, planId);

    res.status(200).json({
      success: true,
      message: "Withdrawn from workout plan successfully",
      data: withdrawal,
    });
  } catch (err) {
    next(err);
  }
};
