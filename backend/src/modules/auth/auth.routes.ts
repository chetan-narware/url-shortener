import {Router} from "express";
import { registerHandler, longinHandler } from "./auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", longinHandler);

export default router;