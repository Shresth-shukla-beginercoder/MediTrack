
import express from "express";

import {
  crtDoctor,
  getDoctorByEmail,
  updoctorProf,
  getDoctorProf,
  upDoctorCred,
  getDoctorVerCred,
  getDoctorInstrc,
} from "../controllers/doctorController.js";

import {
  verifyAuth,
  requireRole,
} from "../middleware/auth.js";

const router = express.Router();

// Doctor registration.
router.post("/register", crtDoctor);

// Email lookup, if required by your authentication flow.
router.post("/lookup-email", getDoctorByEmail);

// All routes below require an authenticated doctor.
router.use(verifyAuth);
router.use(requireRole("doctor"));

// Doctor profile.
router.get("/profile", getDoctorProf);
router.patch("/profile", updoctorProf);

// Verification status and credential corrections.
router.get("/verification-status", getDoctorVerCred);
router.patch("/credentials", upDoctorCred);

// The logged-in doctor's instructions.
router.get("/instructions", getDoctorInstrc);

export default router;
