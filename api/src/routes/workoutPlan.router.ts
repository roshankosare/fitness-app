import { Router } from "express";
import {
  getAllWorkoutPlansController,
  getWorkoutByIdController,
} from "../controllers";

const workoutRouter = Router();

// GET /api/workouts
workoutRouter.get("/", getAllWorkoutPlansController);

// GET /api/workouts/:id
workoutRouter.get("/:id", getWorkoutByIdController);

export { workoutRouter };
