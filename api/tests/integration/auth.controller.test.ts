
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import {
  signInService,
  signUpAdminService,
  signUpService,
} from "../../src/services";
import {
  InternalServerError,
  InvalidEmailNameOrPasswordError,
  UserAlreadyExistsError,
  ValidationError,
} from "../../src/errors";
import { errorHandler } from "../../src/middleware";

// ✅ Mock dependencies
jest.mock("../../src/services");
jest.mock("../../src/validators/auth.validator", () => ({
  singInValidation: jest.fn(),
  signUpValidation: jest.fn(),
}));





// Define JWT secret for tests
process.env.JWT_SECRET = "test-secret";

describe("Auth Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signInController", () => {
    it("should sign in user, set cookie, and return success response", async () => {
      // Mock user returned from service
      (signInService as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        role: "user",
      });

      const res = await request(app)
        .post("/api/auth/sign-in")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();

      // Verify the cookie contains a valid JWT
      const cookieHeader = res.headers["set-cookie"][0];
      const match = cookieHeader.match(/token=([^;]+)/);
      if (!match) {
        throw new Error("Token not found in cookie header");
      }
      const token = match[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      expect(decoded).toHaveProperty("id", "123");
    });

    it("should pass error to next if signInValidation fails", async () => {
      (signInService as jest.Mock).mockRejectedValue(
        new ValidationError("Invalid email or password")
      );

      const res = await request(app)
        .post("/api/auth/sign-in")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(res.status).toBe(400); // since no error handler in this test app
    });

    it("should pass error to next if signInService fails", async () => {
      (signInService as jest.Mock).mockRejectedValue(
        new InvalidEmailNameOrPasswordError()
      );

      const res = await request(app)
        .post("/api/auth/sign-in")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(res.status).toBe(400); // since no error handler in this test app
    });

    it("should pass error to next if signInService fails", async () => {
      (signInService as jest.Mock).mockRejectedValue(new InternalServerError());

      const res = await request(app)
        .post("/api/auth/sign-in")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(res.status).toBe(500); // since no error handler in this test app
    });
  });

  describe("signUpController", () => {
    it("should sign up user, set cookie, and return success response", async () => {
      (signUpService as jest.Mock).mockResolvedValue({
        id: "456",
        email: "new@example.com",
        role: "user",
      });

      const res = await request(app).post("/api/auth/sign-up").send({
        email: "new@example.com",
        password: "abc123",
        fullName: "John",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("new@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should pass error to next if singUpService fails", async () => {
      (signUpService as jest.Mock).mockRejectedValue(
        new UserAlreadyExistsError()
      );

      const res = await request(app).post("/api/auth/sign-up").send({
        email: "exists@example.com",
        password: "abc123",
        fullName: "John",
      });

      expect(res.status).toBe(400);
    });

    it("should pass error to next if singUpService fails", async () => {
      (signUpService as jest.Mock).mockRejectedValue(new InternalServerError());

      const res = await request(app).post("/api/auth/sign-up").send({
        email: "exists@example.com",
        password: "abc123",
        fullName: "John",
      });

      expect(res.status).toBe(500);
    });
  });

  describe("signUpAdminController", () => {
    it("should sign up user, set cookie, and return success response", async () => {
      (signUpAdminService as jest.Mock).mockResolvedValue({
        id: "456",
        email: "new@example.com",
        role: "ADMIN",
      });

      const res = await request(app).post("/api/auth/sign-up/admin").send({
        email: "new@example.com",
        password: "abc123",
        fullName: "John",
        secret: "my-secret",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("new@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should pass error to next if singUpAdmin validation fails", async () => {
      (signUpAdminService as jest.Mock).mockRejectedValue(
        new UserAlreadyExistsError()
      );

      const res = await request(app).post("/api/auth/sign-up/admin").send({
        email: "exists@example.com",
        password: "abc123",
        fullName: "John",
      });

      expect(res.status).toBe(400);
    });

    it("should pass error to next if singUpAdminService fails", async () => {
      (signUpAdminService as jest.Mock).mockRejectedValue(
        new InternalServerError()
      );

      const res = await request(app).post("/api/auth/sign-up/admin").send({
        email: "exists@example.com",
        password: "abc123",
        fullName: "John",
      });

      expect(res.status).toBe(500);
    });
  });
});
