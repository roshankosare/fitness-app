import { Request, Response, NextFunction } from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutsByAdmin,
} from "../services/workout.service";
import { createWorkoutValidation } from "../validators/workout.validator";
import { ValidationError } from "../errors";

export const createWorkoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id; // ✅ from cookie/session middleware
    const { exercise, image } = req.body;

    createWorkoutValidation({ exercise, image });

    const workout = await createWorkout(adminId, { exercise, image });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: workout,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllWorkoutsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workouts = await getAllWorkouts();
    res.json({ success: true, data: workouts });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const workout = await getWorkoutById(id);
    if (!workout) throw new ValidationError("Workout not found");
    res.json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

export const updateWorkoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { exercise, date, image } = req.body;

    createWorkoutValidation({ exercise, date, image });

    const updated = await updateWorkout(id, { exercise, image });

    res.json({
      success: true,
      message: "Workout updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteWorkout(id);
    res.json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const workouts = await getWorkoutsByAdmin(adminId);
    res.json({ success: true, data: workouts });
  } catch (err) {
    next(err);
  }
};
