import request from "supertest";
import * as workoutService from "../../src/services";

import app from "../../src/app";

jest.mock("../../src/services");

describe("Workout Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/workout-plans", () => {
    it("should return all workout plans", async () => {
      const mockPlans = [{ id: "1", createdBy: { fullName: "John Doe" } }];
      (workoutService.getAllWorkoutsPlans as jest.Mock).mockResolvedValue(
        mockPlans
      );

      const response = await request(app).get("/api/workout-plans");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPlans);
      expect(workoutService.getAllWorkoutsPlans).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/workout-plans/:id", () => {
    it("should return a workout plan by id", async () => {
      const mockPlan = {
        id: "1",
        createdBy: { fullName: "John Doe" },
        weeks: [],
      };
      (workoutService.getWorkoutById as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app).get("/api/workout-plans/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPlan);
    });

    it("should handle errors gracefully", async () => {
      (workoutService.getWorkoutById as jest.Mock).mockRejectedValue(
        new Error("Invalid ID")
      );

      const response = await request(app).get("/api/workout-plans/999");

      expect(response.status).toBe(500); // assuming error middleware sets 500
      expect(response.body.success).toBe(false);
    });
  });
});
