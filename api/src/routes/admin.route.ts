import express from "express";
import { adminAuth } from "../middleware/auth.middleware";
import {
  getAdminProfileController,
  updateAdminProfileController,
  createPlanController,
  getAllPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
  addOrUpdatePlanWeekController,
  deletePlanWeekController,
} from "../controllers";
import { upload } from "../middleware";

export const adminRouter = express.Router();

/**

* ─────────────────────────────────────────────────────────────
* 🧑‍💼 Admin Profile Routes
* ─────────────────────────────────────────────────────────────
  */
adminRouter.get("/profile", adminAuth, getAdminProfileController);
adminRouter.put("/profile", adminAuth, updateAdminProfileController);

/**

* ─────────────────────────────────────────────────────────────
* 🏋️ Plan Routes
* ─────────────────────────────────────────────────────────────
  */
adminRouter.post(
  "/plans",
  adminAuth,
  upload.single("image"),
  createPlanController
);
adminRouter.get("/plans", adminAuth, getAllPlansController);
adminRouter.get("/plans/:planId", adminAuth, getPlanByIdController);
adminRouter.put(
  "/plans/:planId",
  adminAuth,
  upload.single("image"),
  updatePlanController
);
adminRouter.delete("/plans/:planId", adminAuth, deletePlanController);

/**

* ─────────────────────────────────────────────────────────────
* 📅 Plan Week Routes
* ─────────────────────────────────────────────────────────────
  */
adminRouter.post(
  "/plans/:planId/weeks",
  adminAuth,
  addOrUpdatePlanWeekController
);
adminRouter.delete(
  "/plans/:planId/weeks/:weekId",
  adminAuth,
  deletePlanWeekController
);
