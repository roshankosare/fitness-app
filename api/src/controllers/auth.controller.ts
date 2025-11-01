import { NextFunction, Request, Response } from "express";
import {
  signUpValidation,
  singInValidation,
} from "../validators/auth.validator";
import jwt from "jsonwebtoken";
import { signInService, signUpService, signUpAdminService } from "../services";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { email, password } = body;

    //validate input for sing-in

    singInValidation({ email: email, password: password });

    const user = await signInService({ email, password });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { email, fullName, password } = body;

    signUpValidation({ email, password, fullName });

    const user = await signUpService({ email, password, fullName });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const signUpAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { email, fullName, password, secret } = body;

    signUpValidation({ email, password, fullName });

    const user = await signUpAdminService({
      email,
      password,
      fullName,
      secret,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.status(200).json({
    success: true,
    message: "Signed in successfully",
    user: { id: user.id, email: user.email, role: user.role },
  });
};

export const signOutUser = async (req: Request, res: Response) => {
  const user = (req as any).user || (req as any).admin;
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
};
