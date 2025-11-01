import { Request, Response, NextFunction } from "express";
import { getAllWorkoutsPlans, getWorkoutById } from "../services";

export const getAllWorkoutPlansController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plans = await getAllWorkoutsPlans();
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkoutPlanByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const plan = await getWorkoutById(id);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};
