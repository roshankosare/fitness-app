import request from "supertest";
import app from "../../src/app";
import jwt from "jsonwebtoken";
import * as services from "../../src/services";

jest.mock("../../src/services");
// ✅ Mock adminAuth middleware
jest.mock("../../src/middleware/auth.middleware", () => ({
  userAuth: jest.fn((req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided in cookies",
      });
    }

    req.user = { id: 1, email: "admin@example.com" };
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
const ADMIN_ID = "admin123";
const ADMIN_TOKEN = jwt.sign(
  { id: ADMIN_ID, role: "ADMIN" },
  process.env.JWT_SECRET || "testsecret"
);

describe("Admin Routes Integration (using cookies)", () => {
  beforeEach(() => jest.clearAllMocks());

  const cookie = [`token=${ADMIN_TOKEN}`];

  it("should reject request without cookie", async () => {
    const res = await request(app).get("/api/admin/profile");
    expect(res.status).toBe(401);
  });

  it("should allow request with valid cookie and return profile", async () => {
    (services.getAdminProfile as jest.Mock).mockResolvedValue({
      id: ADMIN_ID,
      email: "admin@test.com",
    });

    const res = await request(app)
      .get("/api/admin/profile")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("admin@test.com");
  });

  it("should create a plan successfully", async () => {
    (services.createPlan as jest.Mock).mockResolvedValue({
      id: "plan1",
      name: "Workout Plan",
    });

    const res = await request(app)
      .post("/api/admin/plans")
      .set("Cookie", cookie)
      .send({ name: "Workout Plan", description: "Build strength" });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Workout Plan");
  });

  it("should update a plan successfully", async () => {
    (services.updatePlan as jest.Mock).mockResolvedValue({
      id: "plan1",
      name: "Updated Plan",
    });

    const res = await request(app)
      .put("/api/admin/plans/plan1")
      .set("Cookie", cookie)
      .send({ name: "Updated Plan", description: "Updated desc" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Plan");
  });

  it("should delete a plan successfully", async () => {
    (services.deletePlan as jest.Mock).mockResolvedValue({
      message: "Plan deleted successfully",
    });

    const res = await request(app)
      .delete("/api/admin/plans/plan1")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Plan deleted successfully");
  });

  it("should add or update plan week with sets and reps", async () => {
    (services.addOrUpdatePlanWeek as jest.Mock).mockResolvedValue({
      id: "week1",
      weekNumber: 1,
      activities: [
        { exercise: "Bench Press", sets: 4, reps: 10 },
        { exercise: "Deadlift", sets: 3, reps: 8 },
      ],
    });

    const res = await request(app)
      .post("/api/admin/plans/plan1/weeks")
      .set("Cookie", cookie)
      .send({
        weekNumber: 1,
        activities: [
          { exercise: "Bench Press", sets: 4, reps: 10 },
          { exercise: "Deadlift", sets: 3, reps: 8 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.activities.length).toBe(2);
  });

  it("should delete a plan week successfully", async () => {
    (services.deletePlanWeek as jest.Mock).mockResolvedValue({
      message: "Week deleted successfully",
    });

    const res = await request(app)
      .delete("/api/admin/plans/plan1/weeks/week1")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Week deleted successfully");
  });
});
