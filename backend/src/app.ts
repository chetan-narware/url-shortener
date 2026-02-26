import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

//
// Security Headers
//
app.use(helmet());

//
// Enable CORS
//
app.use(
  cors({
    origin: "*", // restrict later in production
    methods: ["GET", "POST"],
  })
);

//
// Body Parser
//
app.use(express.json());

//
// HTTP Request Logger
//
app.use(morgan("dev"));

//
// Rate Limiter
//
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

app.use(limiter);

//
// Health Route
//
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

//
// Global Error Middleware (VERY IMPORTANT)
//
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;