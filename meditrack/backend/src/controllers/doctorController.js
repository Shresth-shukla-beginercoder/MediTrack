import { createDoctor, 
        doctorByEmail, 
        getDoctorInstructions,
        getDoctorProfile,
        getDoctorVerificationStatus,
        updateDoctorCredentials,
        updateDoctorProfile, 
        updateDoctorStatus} from "../models/doctorModel.js";
import bcrypt from "bcrypt";


export const crtDoctor = async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      password,
      degree,
      graduation_year,
      college_name,
      professional_registration_number,
      registration_authority,
      registration_document_url,
      workplace,
      specialization,
      public_phone,
      social_media_url,
    } = req.body ?? {};

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !password ||
      !degree?.toString().trim() ||
      !graduation_year ||
      !college_name?.trim() ||
      !professional_registration_number?.trim() ||
      !registration_authority?.trim() ||
      !workplace?.trim() ||
      !specialization?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingDoctor = await doctorByEmail(normalizedEmail);

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "A doctor account with this email already exists.",
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const crtDoc = await createDoctor(
      full_name.trim(),
      normalizedEmail,
      password_hash,
      degree,
      Number(graduation_year),
      college_name.trim(),
      professional_registration_number.trim(),
      registration_authority.trim(),
      registration_document_url || null,
      workplace.trim(),
      specialization.trim(),
      public_phone || null,
      social_media_url || null
    );

    if (!crtDoc) {
      return res.status(500).json({
        success: false,
        message: "Unable to create doctor account.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully.",
      doctor: {
        doctor_id: crtDoc.doctor_id,
        full_name: crtDoc.full_name,
        email: crtDoc.email,
        verification_status: crtDoc.verification_status,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getDoctorByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const docEmail = await doctorByEmail(email.trim());

    if (!docEmail) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      doctor: {
        doctor_id: docEmail.doctor_id,
        email: docEmail.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updoctorProf = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      registration_authority,
      workplace,
      specialization,
      public_phone,
      social_media_url
    } = req.body;

    const Updoctor = await updateDoctorProfile(
      full_name,
      registration_authority,
      workplace,
      specialization,
      public_phone,
      social_media_url,
      id
    );

    if (!Updoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor: {
        doctor_id: Updoctor.doctor_id,
        full_name: Updoctor.full_name,
        email: Updoctor.email,
        degree: Updoctor.degree,
        specialization: Updoctor.specialization,
        workplace: Updoctor.workplace,
        public_phone: Updoctor.public_phone,
        social_media_url: Updoctor.social_media_url
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorProf = async (req, res, next) => {
  try {
   const id = req.user.id;

    const ProfDoctor = await getDoctorProfile(id);

    if (!ProfDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile retrieved successfully",
      doctor: ProfDoctor
    });
  } catch (error) {
    next(error);
  }
};

export const upDoctorCred = async (req, res, next) => {
  try {
    const id = req.user.id;
    const data = req.body;

    const upDocCred = await updateDoctorCredentials(id, data);

    if (!upDocCred) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor credentials updated successfully",
      doctor: {
        doctor_id: upDocCred.doctor_id,
        degree: upDocCred.degree,
        graduation_year: upDocCred.graduation_year,
        college_name: upDocCred.college_name,
        professional_registration_number:
          upDocCred.professional_registration_number,
        registration_authority: upDocCred.registration_authority,
        registration_document_url: upDocCred.registration_document_url,
        verification_status: upDocCred.verification_status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorVerCred = async (req, res, next) => {
  try {
    const id = req.user.id;

    const status = await getDoctorVerificationStatus(id);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification status retrieved successfully",
      status
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorInstrc = async (req, res, next) => {
  try {
    const { id } = req.params;

    const instructions = await getDoctorInstructions(id);

    return res.status(200).json({
      success: true,
      message: "Doctor instructions retrieved successfully",
      instructions
    });
  } catch (error) {
    next(error);
  }
};


export const updoctorstat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_message } = req.body;
    const adminId = req.user.id;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "suspended"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status"
      });
    }

    const doctorStat = await updateDoctorStatus(id, status, adminId, admin_message);

    if (!doctorStat) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor verification status updated successfully",
      doctor: {
        doctor_id: doctorStat.doctor_id,
        verification_status: doctorStat.verification_status,
        admin_message: doctorStat.admin_message,
        reviewed_at: doctorStat.reviewed_at
      }
    });
  } catch (error) {
    next(error);
  }
};