
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import pool from "./config/db.js";

import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, ApiError } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import instructionRoutes from "./routes/instruction.router.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import doctorInstructionRoutes from "./routes/doctorInstructionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
const allowedOrigin =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Parse request bodies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 4. Rate-limit API requests
app.use("/api", generalLimiter);

// 5. Health check
app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "MediTrack API is operational",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    next(new ApiError(503, "Database service is currently unavailable"));
  }
});

// 6. Mount all API routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/doctor/instructions", doctorInstructionRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/instructions", instructionRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/admin", adminRoutes);

// 7. API root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to MediTrack API. Visit /api/health for system status.",
  });
});

// 8. Unknown routes
app.use((req, res, next) => {
  next(
    new ApiError(
      404,
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
});

// 9. Centralized error handler — always last
app.use(errorHandler);

export default app;
