import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import urlRoutes from "./modules/url/url.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";

const app = express();

// Security Headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: "*", // restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Body Parser
app.use(express.json());

// HTTP Request Logger
app.use(morgan("dev"));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

app.use(limiter);

// Health Route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// URL Routes
app.use("/api/urls", urlRoutes);

// analytics
app.use("/api/analytics", analyticsRoutes);

// 404 Handler (Optional but recommended)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Global Error Handler (Must be last)
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("Global Error:", err);

    if (err instanceof Error) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

export default app;