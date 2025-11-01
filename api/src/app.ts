import express, { Application } from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error.middleware";
import {
  authRouter,
  healthRouter,
  userRouter,
  adminRouter,
  workoutPlanRouter,
} from "./routes";

import cookieParser from "cookie-parser";
import path from "path";
import workoutRouter from "./routes/workout.router";

const app: Application = express();

// Middleware
app.use(cors({ origin: true, credentials: true })); // allow cookies from client
app.use(express.json());
app.use(cookieParser());
// Routes

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/user-profile", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/workout-plans", workoutPlanRouter);
app.use("/api/workouts", workoutRouter);

// Error Handling Middleware
app.use(errorHandler);

export default app;
