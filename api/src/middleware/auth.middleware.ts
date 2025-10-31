import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

// Middleware to verify any logged-in user
export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // read token from cookie

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token found.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

// Middleware to verify admin access
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token found.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
