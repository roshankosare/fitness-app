import { Router } from "express";
import {
  signInController,
  signUpAdminController,
  signUpController,
} from "../controllers";

export const authRouter = Router();

authRouter.post("/sign-in", signInController);
authRouter.post("/sign-up", signUpController);
authRouter.post("/sign-up/admin", signUpAdminController);
