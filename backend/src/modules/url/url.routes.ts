import { Router } from "express";
import {
  createUrlHandler,
  redirectHandler,
  deleteUrlHandler,
} from "./url.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createUrlHandler);
router.get("/:shortCode", redirectHandler);
router.delete("/:shortCode", authenticate, deleteUrlHandler);

export default router;