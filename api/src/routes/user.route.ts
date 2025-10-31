import express from "express";
import {
  getUserProfileController,
  subscribeWorkoutPlanController,
  updateUserProfileController,
  withdrawWorkoutPlanController,
} from "../controllers";
import { userAuth } from "../middleware/auth.middleware";

export const userRouter = express.Router();
// userRouter.get("/");
userRouter.get("/", userAuth, getUserProfileController);
userRouter.put("/", userAuth, updateUserProfileController);
userRouter.post(
  "/subscribe/:planId",
  userAuth,
  subscribeWorkoutPlanController
);
userRouter.post(
  "/withdraw/:planId",
  userAuth,
  withdrawWorkoutPlanController
);
