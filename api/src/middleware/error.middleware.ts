import { Request, Response, NextFunction } from "express";
import {
  UserAlreadyExistsError,
  InvalidEmailNameOrPasswordError,
  ValidationError,
  ExistingCurrentPlanError,
  ExistingPlanError,
} from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);

  switch (true) {
    case err instanceof ValidationError:
      return res.status(400).json({ success: false, message: err.message });
    case err instanceof InvalidEmailNameOrPasswordError:
      return res.status(400).json({ success: false, message: err.message });
    case err instanceof UserAlreadyExistsError:
      return res.status(400).json({ success: false, message: err.message });
    case err instanceof ExistingCurrentPlanError:
      return res.status(409).json({ success: false, message: err.message });
    case err instanceof ExistingPlanError:
      return res.status(409).json({ success: false, message: err.message });
    default:
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
  }
};
