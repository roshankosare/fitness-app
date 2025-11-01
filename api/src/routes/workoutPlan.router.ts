import { Router } from "express";
import {
  getAllWorkoutPlansController,
  getWorkoutPlanByIdController,
} from "../controllers";

const workoutPlanRouter = Router();

// GET /api/workouts
workoutPlanRouter.get("/", getAllWorkoutPlansController);

// GET /api/workouts/:id
workoutPlanRouter.get("/:id", getWorkoutPlanByIdController);

export { workoutPlanRouter };
