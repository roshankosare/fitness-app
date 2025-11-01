import { Request, Response, NextFunction } from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  addOrUpdatePlanWeek,
  deletePlanWeek,
} from "../services";
import {
  createPlanValidation,
  updateAdminProfileValidation,
  updatePlanValidation,
} from "../validators";

/**

* ─────────────────────────────────────────────────────────────
* 🧑‍💼 Admin Profile Controllers
* ─────────────────────────────────────────────────────────────
  */

export const getAdminProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id; // ✅ fetched from cookie JWT
    const admin = await getAdminProfile(adminId);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdminProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user.id; // ✅ from token
    const { email, fullName } = req.body;
    updateAdminProfileValidation({ email, fullName });
    const updated = await updateAdminProfile(adminId, { email, fullName });

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**

* ─────────────────────────────────────────────────────────────
* 🏋️ Plan Management Controllers
* ─────────────────────────────────────────────────────────────
  */

export const createPlanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id; // ✅ from cookie
    const { name, description } = req.body;
    const image = (req as any).file;
    createPlanValidation({ name, description });
    const plan = await createPlan(adminId, {
      name,
      description,
      bannerImage: image || null,
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPlansController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const plans = await getAllPlans(adminId);
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (err) {
    next(err);
  }
};

export const getPlanByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planId = req.params.planId;
    const plan = await getPlanById(planId);

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePlanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const planId = req.params.planId;
    const { name, description } = req.body;
    const image = (req as any).file;

    updatePlanValidation({ name, description });
    const updatedPlan = await updatePlan(adminId, planId, {
      name,
      description,
      bannerImage:image 
    });

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const planId = req.params.planId;
    const result = await deletePlan(adminId, planId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.archived || null,
    });
  } catch (err) {
    next(err);
  }
};

/**

* ─────────────────────────────────────────────────────────────
* 📅 Plan Week Management Controllers
* ─────────────────────────────────────────────────────────────
  */

export const addOrUpdatePlanWeekController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const { planId } = req.params;
    const { weekNumber, activities } = req.body;

    const week = await addOrUpdatePlanWeek(
      adminId,
      planId,
      weekNumber,
      activities
    );

    res.status(200).json({
      success: true,
      message: "Plan week added/updated successfully",
      data: week,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlanWeekController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).admin.id;
    const { planId, weekId } = req.params;

    const result = await deletePlanWeek(adminId, planId, weekId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
