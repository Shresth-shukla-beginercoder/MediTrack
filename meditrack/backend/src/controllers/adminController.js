
import {
  getAdminProfile,
  getAllDoctorsForAdmin,
  getDoctorByIdForAdmin,
} from "../models/adminModel.js";

import { updateDoctorStatus } from "../models/doctorModel.js";
import { ApiError } from "../middleware/errorHandler.js";

const allowedStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
];

function parseDoctorId(value) {
  const doctorId = Number(value);

  if (!Number.isSafeInteger(doctorId) || doctorId <= 0) {
    throw new ApiError(400, "Invalid doctor ID");
  }

  return doctorId;
}

// GET admin profile
export async function getMe(req, res, next) {
  try {
    const admin = await getAdminProfile(req.user.id);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    return next(error);
  }
}

// GET doctors, optionally filtered by verificationStatus
export async function listDoctors(req, res, next) {
  try {
    const status = req.query.verificationStatus;

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !allowedStatuses.includes(status))
    ) {
      throw new ApiError(400, "Invalid verification status");
    }

    const doctors = await getAllDoctorsForAdmin(status ?? null);

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return next(error);
  }
}

// GET one doctor's review details
export async function getDoctorDetails(req, res, next) {
  try {
    const doctorId = parseDoctorId(req.params.id);
    const doctor = await getDoctorByIdForAdmin(doctorId);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH doctor verification status
export async function reviewDoctor(req, res, next) {
  try {
    const doctorId = parseDoctorId(req.params.id);
    const { status, admin_message = null } = req.body;

    if (
      typeof status !== "string" ||
      !["approved", "rejected", "suspended"].includes(status)
    ) {
      throw new ApiError(400, "Invalid review status");
    }

    if (
      admin_message !== null &&
      (typeof admin_message !== "string" ||
        admin_message.length > 2000)
    ) {
      throw new ApiError(400, "Invalid admin message");
    }

    const doctor = await updateDoctorStatus(
      doctorId,
      status,
      req.user.id,
      admin_message?.trim() || null
    );

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    return res.status(200).json({
      success: true,
      message: `Doctor ${status} successfully`,
      doctor,
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH request additional information from a doctor
export async function requestDoctorInformation(req, res, next) {
  try {
    const doctorId = parseDoctorId(req.params.id);
    const { admin_message } = req.body;

    if (
      typeof admin_message !== "string" ||
      !admin_message.trim() ||
      admin_message.trim().length > 2000
    ) {
      throw new ApiError(
        400,
        "A message of 1–2000 characters is required"
      );
    }

    const doctor = await updateDoctorStatus(
      doctorId,
      "pending",
      req.user.id,
      admin_message.trim()
    );

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    return res.status(200).json({
      success: true,
      message: "Additional information requested",
      doctor,
    });
  } catch (error) {
    return next(error);
  }
}
