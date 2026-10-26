
import express from "express";

import {
  createInstructionController,
  getInstructionByIdController,
  getDoctorInstructionsController,
  updateInstructionController,
  deleteInstructionController,
  updateInstructionPublicationController,
} from "../controllers/doctorInstructionController.js";

import {
  verifyAuth,
  requireRole,
  requireApprovedDoctor,
} from "../middleware/auth.js";

const router = express.Router();

// Every route requires a logged-in doctor.
router.use(verifyAuth);
router.use(requireRole("doctor"));

// Create a new instruction draft.
router.post("/", createInstructionController);

// List only the logged-in doctor's instructions.
router.get("/", getDoctorInstructionsController);

// Get one instruction belonging to the logged-in doctor.
router.get("/:id", getInstructionByIdController);

// Update an instruction belonging to the logged-in doctor.
router.patch("/:id", updateInstructionController);

// Delete an instruction belonging to the logged-in doctor.
router.delete("/:id", deleteInstructionController);

// Publish or withdraw an instruction.
router.patch(
  "/:id/publication",
  requireApprovedDoctor,
  updateInstructionPublicationController
);
export default router;
