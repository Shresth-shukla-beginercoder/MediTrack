
import express from "express";

import {
  getMe,
  listDoctors,
  getDoctorDetails,
  reviewDoctor,
  requestDoctorInformation,
} from "../controllers/adminController.js";

import {
  verifyAuth,
  requireRole,
} from "../middleware/auth.js";
import { updoctorstat } from "../controllers/doctorController.js";

const router = express.Router();

// All routes below require an authenticated admin.
router.use(verifyAuth);
router.use(requireRole("admin"));

router.get("/me", getMe);

router.get("/doctors", listDoctors);

router.get("/doctors/:id", getDoctorDetails);

router.patch("/doctors/:id/review", reviewDoctor);

router.patch(
  "/doctors/:id/request-information",
  requestDoctorInformation
);


// Update a doctor's verification status.
router.patch("/doctors/:id/verification-status", updoctorstat);

export default router;
