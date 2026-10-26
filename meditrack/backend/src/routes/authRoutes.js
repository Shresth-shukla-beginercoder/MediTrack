
import express from "express";

import {
  registerUser,
  registerDoctor,
  login,
  getMe,
} from "../controllers/authController.js";

import {
  validateUserRegister,
  validateDoctorRegister,
  validateLogin,
} from "../middleware/validate.js";

import { verifyAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public authentication endpoints.
router.post(
  "/register/user",
  authLimiter,
  validateUserRegister,
  registerUser
);

router.post(
  "/register/doctor",
  authLimiter,
  validateDoctorRegister,
  registerDoctor
);

router.post(
  "/login",
  authLimiter,
  validateLogin,
  login
);

// Protected endpoint: get the authenticated account's profile.
router.get("/me", verifyAuth, getMe);

export default router;
