
import {
  createInstruction,
  instructionByID,
  getDoctorInstructions,
  getPublishedInstructions,
  updateInstruction,
  deleteInstruction,
  updateInstructionPublication,
} from "../models/instructionModel.js";

// Create a new instruction draft.
export const createInstructionController = async (req, res, next) => {
  try {
    const {
      condition_name,
      title,
      medical_overview,
      medicine_name,
      general_usage_information,
      safety_warnings,
      when_to_seek_care,
    } = req.body;

    const doctor_id = req.user.id;

    const instruction = await createInstruction(
      doctor_id,
      condition_name,
      title,
      medical_overview,
      medicine_name,
      general_usage_information,
      safety_warnings,
      when_to_seek_care
    );

    return res.status(201).json({
      success: true,
      message: "Instruction created successfully as a draft",
      instruction,
    });
  } catch (error) {
    return next(error);
  }
};

// Get one instruction belonging to the logged-in doctor.
export const getInstructionByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor_id = req.user.id;

    const instruction = await instructionByID(id, doctor_id);

    if (!instruction) {
      return res.status(404).json({
        success: false,
        message: "Instruction not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      instruction,
    });
  } catch (error) {
    return next(error);
  }
};

// List the logged-in doctor's instructions.
export const getDoctorInstructionsController = async (req, res, next) => {
  try {
    const doctor_id = req.user.id;
    const instructions = await getDoctorInstructions(doctor_id);

    return res.status(200).json({
      success: true,
      instructions,
    });
  } catch (error) {
    return next(error);
  }
};

// Get published instructions for ordinary users.
export const getPublishedInstructionsController = async (req, res, next) => {
  try {
    const instructions = await getPublishedInstructions();

    return res.status(200).json({
      success: true,
      instructions,
    });
  } catch (error) {
    return next(error);
  }
};

// Update an instruction belonging to the logged-in doctor.
export const updateInstructionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor_id = req.user.id;

    const instruction = await updateInstruction(id, doctor_id, req.body);

    if (!instruction) {
      return res.status(404).json({
        success: false,
        message: "Instruction not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instruction updated successfully",
      instruction,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete an instruction belonging to the logged-in doctor.
export const deleteInstructionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor_id = req.user.id;

    const deleted = await deleteInstruction(id, doctor_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Instruction not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instruction deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Publish or withdraw an instruction.
export const updateInstructionPublicationController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const doctor_id = req.user.id;
    const { publication_status } = req.body;

    if (!["published", "draft"].includes(publication_status)) {
      return res.status(400).json({
        success: false,
        message: "publication_status must be 'published' or 'draft'",
      });
    }

    const instruction = await updateInstructionPublication(
      id,
      doctor_id,
      publication_status
    );

    if (!instruction) {
      return res.status(404).json({
        success: false,
        message: "Instruction not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        publication_status === "published"
          ? "Instruction published successfully"
          : "Instruction withdrawn and saved as a draft",
      instruction,
    });
  } catch (error) {
    return next(error);
  }
};
