import { Router } from "express";
import {
  createWorkoutController,
  getAllWorkoutsController,
  getWorkoutByIdController,
  getWorkoutsByAdminController,
  updateWorkoutController,
  deleteWorkoutController,
} from "../controllers";
import { adminAuth, upload } from "../middleware";

const workoutRouter = Router();

// Admin-authenticated routes
workoutRouter.post(
  "",
  adminAuth,
  upload.single("image"),
  createWorkoutController
);
workoutRouter.get("", getAllWorkoutsController);
workoutRouter.get("/:id", getWorkoutByIdController);
workoutRouter.get("/admin/all", adminAuth, getWorkoutsByAdminController);
workoutRouter.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  updateWorkoutController
);
workoutRouter.delete("/:id", adminAuth, deleteWorkoutController);

export default workoutRouter;
