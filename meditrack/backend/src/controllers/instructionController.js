
import {
  getPublishedInstructions,
  getPublishedInstructionById,
} from "../models/instructionModel.js";

import { ApiError } from "../middleware/errorHandler.js";

// GET /api/v1/instructions
export async function getPublishedInstructionsController(req, res, next) {
  try {
    const instructions = await getPublishedInstructions();

    return res.status(200).json({
      success: true,
      count: instructions.length,
      data: instructions,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/v1/instructions/:id
export async function getPublishedInstructionByIdController(req, res, next) {
  try {
    const instructionId = Number(req.params.id);

    if (
      !Number.isSafeInteger(instructionId) ||
      instructionId <= 0
    ) {
      throw new ApiError(400, "Invalid instruction ID.");
    }

    const instruction =
      await getPublishedInstructionById(instructionId);

    if (!instruction) {
      throw new ApiError(404, "Published instruction not found.");
    }

    return res.status(200).json({
      success: true,
      data: instruction,
    });
  } catch (error) {
    return next(error);
  }
}
