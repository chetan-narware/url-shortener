import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();
const controller = new AnalyticsController();

router.get(
  "/:shortCode",
  authenticate,
  controller.getUrlAnalytics.bind(controller)
);

router.get(
  "/user",
  authenticate,
  controller.getUserAnalytics.bind(controller)
);

export default router;