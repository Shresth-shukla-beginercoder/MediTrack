
import express from "express";

import {
  getMyUserProfile,
  updateMyUserProfile,
} from "../controllers/userController.js";

import {
  verifyAuth,
  requireRole,
} from "../middleware/auth.js";

const router = express.Router();

// Both endpoints require an authenticated user.
router.use(verifyAuth);
router.use(requireRole("user"));

// GET /api/v1/users/me
router.get("/me", getMyUserProfile);

// PATCH /api/v1/users/me
router.patch("/me", updateMyUserProfile);

export default router;
