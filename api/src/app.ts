import express, { Application } from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error.middleware";
import { authRouter, healthRouter, userRouter, adminRouter } from "./routes";

import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(cors({ origin: true, credentials: true })); // allow cookies from client
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/user-profile", userRouter);
app.use("/api/admin", adminRouter);

// Error Handling Middleware
app.use(errorHandler);

export default app;
