import request from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/user.service";
import { ValidationError } from "../../src/errors";
import jwt from "jsonwebtoken";
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

describe("User Controller Integration Tests", () => {
  const userId = "user-123";
  const planId = "plan-456";
  const cookie = [`token=${ADMIN_TOKEN}`];
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users/:id", () => {
    it("should return user profile for valid ID", async () => {
      const mockUser = {
        fullName: "John Doe",
        email: "[john@example.com](mailto:john@example.com)",
        userProfile: { age: 25, weightKg: 70, activity: "active", goal: "fit" },
      };

      (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .get(`/api/user-profile`)
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockUser);
      expect(userService.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it("should handle error for unauthorized user", async () => {
      (userService.getUserProfile as jest.Mock).mockRejectedValue(
        new ValidationError("incorrect user id")
      );

      const res = await request(app).get(`/api/user-profile`);

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/user-profile", () => {
    it("should update user profile successfully", async () => {
      const mockUpdate = {
        age: 28,
        weightKg: 75,
        goal: "muscle gain",
        activity: "high",
      };

      (userService.updateUserProfile as jest.Mock).mockResolvedValue(
        mockUpdate
      );

      const res = await request(app)
        .put(`/api/user-profile`)
        .send(mockUpdate)
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockUpdate);
      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        userId,
        mockUpdate
      );
    });
  });

  describe("POST /api/user-profile/subscribe/:planId", () => {
    it("should subscribe user to workout plan", async () => {
      const mockSubscription = { userId, planId };

      (userService.subscribeWorkoutPlan as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const res = await request(app)
        .post(`/api/user-profile/subscribe/${planId}`)
        .set("Cookie", cookie);

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual(mockSubscription);
      expect(userService.subscribeWorkoutPlan).toHaveBeenCalledWith(
        userId,
        planId
      );
    });
  });

  describe("DELETE /api/user-profile/withdraw/:planId", () => {
    it("should withdraw user from workout plan", async () => {
      const mockWithdrawal = { count: 1 };

      (userService.withdrawWorkoutPlan as jest.Mock).mockResolvedValue(
        mockWithdrawal
      );

      const res = await request(app)
        .post(`/api/user-profile/withdraw/${planId}`)
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Withdrawn from workout plan successfully");
      expect(res.body.data).toEqual(mockWithdrawal);
      expect(userService.withdrawWorkoutPlan).toHaveBeenCalledWith(
        userId,
        planId
      );
    });
  });
});
