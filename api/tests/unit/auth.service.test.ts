import { compare, hash } from "bcrypt";
import { prisma } from "../../src/util/db";
import {
  signInService,
  signUpService,
  signUpAdminService,
} from "../../src/services/auth.service";
import {
  InvalidEmailNameOrPasswordError,
  UserAlreadyExistsError,
  InternalServerError,
  InvalidAdminSecrete,
  ValidationError,
} from "../../src/errors";

// Mock bcrypt and prisma
jest.mock("bcrypt");
jest.mock("../../src/util/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Auth Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- signInService ---
  describe("signInService", () => {
    it("should return user on successful sign in", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        password: "hashedPass",
        role: "USER",
      });
      (compare as jest.Mock).mockResolvedValue(true);

      const user = await signInService({
        email: "test@example.com",
        password: "password123",
      });

      expect(user).toEqual({
        id: "123",
        email: "test@example.com",
        role: "USER",
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should throw error if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        signInService({ email: "notfound@example.com", password: "pass" })
      ).rejects.toThrow(InvalidEmailNameOrPasswordError);
    });

    it("should throw error if password invalid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
        password: "hashedPass",
        role: "USER",
      });
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        signInService({ email: "test@example.com", password: "wrongpass" })
      ).rejects.toThrow(InvalidEmailNameOrPasswordError);
    });
  });

  // --- singUpService ---
  describe("singUpService", () => {
    it("should create and return user on successful signup", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "456",
        email: "new@example.com",
        role: "USER",
      });

      const result = await signUpService({
        email: "new@example.com",
        password: "Password@123",
        fullName: "John Doe",
      });

      expect(result).toEqual({
        id: "456",
        email: "new@example.com",
        role: "USER",
      });
      expect(hash).toHaveBeenCalledWith("Password@123", 10);
    });

    it("should throw UserAlreadyExistsError if user exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "789",
        email: "exists@example.com",
      });

      await expect(
        signUpService({
          email: "exists@example.com",
          password: "Password@123",
          fullName: "Jane",
        })
      ).rejects.toThrow(UserAlreadyExistsError);
    });

    it("should throw InternalServerError if user creation fails", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue(null);

      await expect(
        signUpService({
          email: "fail@example.com",
          password: "Password@123",
          fullName: "Fail User",
        })
      ).rejects.toThrow(InternalServerError);
    });
  });

  // --- signUpAdminService ---
  describe("signUpAdminService", () => {
    beforeAll(() => {
      process.env.ADMIN_SECRETE = "super-secret";
    });

    it("should create admin if secret is valid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue("hashedPass");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "999",
        email: "admin@example.com",
        role: "ADMIN",
      });

      const admin = await signUpAdminService({
        email: "admin@example.com",
        password: "Password@123",
        fullName: "Admin",
        secret: "super-secret",
      });

      expect(admin).toEqual({
        id: "999",
        email: "admin@example.com",
        role: "ADMIN",
      });
    });

    it("should throw InvalidAdminSecrete if secret is wrong", async () => {
      await expect(
        signUpAdminService({
          email: "admin@example.com",
          password: "Password@123",
          fullName: "Admin",
          secret: "wrong-secret",
        })
      ).rejects.toThrow(InvalidAdminSecrete);
    });

    it("should throw UserAlreadyExistsError if admin already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "123",
        email: "admin@example.com",
      });

      await expect(
        signUpAdminService({
          email: "admin@example.com",
          password: "Password@123",
          fullName: "Admin",
          secret: "super-secret",
        })
      ).rejects.toThrow(UserAlreadyExistsError);
    });

    it("should throw InternalServerError if prisma.create fails", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue("hashedPass");
      (prisma.user.create as jest.Mock).mockResolvedValue(null);

      await expect(
        signUpAdminService({
          email: "admin@example.com",
          password: "Password@123",
          fullName: "Admin",
          secret: "super-secret",
        })
      ).rejects.toThrow(InternalServerError);
    });
  });
});
