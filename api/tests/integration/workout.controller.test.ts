import request from "supertest";
import { prisma } from "../../src/util/db";
import app from "../../src/app";
import jwt from "jsonwebtoken";
jest.mock("../../src/util/db", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    workout: { create: jest.fn() },
  },
}));

jest.mock("../../src/services/user.service");

const USER_ID = "user-123";
jest.mock("../../src/middleware/auth.middleware", () => ({
  userAuth: jest.fn((req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided in cookies",
      });
    }

    req.user = { id: USER_ID, email: "admin@example.com" };
    next();
  }),
  adminAuth: jest.fn((req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided in cookies",
      });
    }

    req.admin = { id: 1, email: "admin@example.com" };
    next();
  }),
}));

const ADMIN_TOKEN = jwt.sign(
  { id: USER_ID, role: "ADMIN" },
  process.env.JWT_SECRET || "testsecret"
);

describe("Workout Integration", () => {
  const cookie = [`token=${ADMIN_TOKEN}`];
  it("should create a workout successfully", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user123" });
    (prisma.workout.create as jest.Mock).mockResolvedValue({
      id: "w1",
      exercise: "Push Ups",
      createdById: "user123",
    });

    const res = await request(app)
      .post("/api/workouts")
      .send({ exercise: "Push Ups", date: new Date() })
      .set("Cookie", cookie);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.exercise).toBe("Push Ups");
  });

  it("should fail validation for short exercise name", async () => {
    const res = await request(app)
      .post("/api/workouts")
      .send({ exercise: "P" })
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      /Exercise name must be at least 3 characters long/
    );
  });

  it("should throw UnauthorizedError if user missing", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/workouts")
      .send({ exercise: "Push Ups" })

    expect(res.status).toBe(401);
  });
});
