
import express from "express";

import {
  createSchedule,
  getMySchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

import {
  verifyAuth,
  requireRole,
} from "../middleware/auth.js";
import { validateSchedule } from "../middleware/validate.js";

const router = express.Router();

// All schedule routes require an authenticated user.
router.use(verifyAuth);
router.use(requireRole("user"));

// Create a private medication schedule.
router.post("/", createSchedule);

// List only the logged-in user's schedules.
router.get("/", getMySchedules);

// Retrieve one schedule owned by the logged-in user.
router.get("/:id", getScheduleById);

// Partially update an owned schedule.
router.patch("/:id",validateSchedule, updateSchedule);

// Delete an owned schedule.
router.delete("/:id", deleteSchedule);

export default router;
