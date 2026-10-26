
import express from "express";

import {
  getPublishedInstructionsController,
  getPublishedInstructionByIdController,
} from "../controllers/instructionController.js";

const router = express.Router();

// Public: list all published instructions.
router.get("/", getPublishedInstructionsController);

// Public: retrieve one published instruction.
router.get("/:id", getPublishedInstructionByIdController);

export default router;
