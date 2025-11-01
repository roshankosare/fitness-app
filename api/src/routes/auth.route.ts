import { Router } from "express";
import {
  getAuthUser,
  signInController,
  signOutUser,
  signUpAdminController,
  signUpController,
} from "../controllers";
import { userAuth } from "../middleware";

export const authRouter = Router();

authRouter.post("/sign-in", signInController);
authRouter.post("/sign-up", signUpController);
authRouter.post("/sign-up/admin", signUpAdminController);
authRouter.post("/user", userAuth, getAuthUser);

authRouter.post("/logout", userAuth, signOutUser);
