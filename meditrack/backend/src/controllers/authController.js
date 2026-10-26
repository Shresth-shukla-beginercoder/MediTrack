
import bcrypt from "bcrypt";

import {
  userByEmail,
  createUser,
  getUserProfile,
} from "../models/userModel.js";

import {
  doctorByEmail,
  createDoctor,
  getDoctorProfile,
} from "../models/doctorModel.js";

import {
  adminByEmail,
  getAdminProfile,
} from "../models/adminModel.js";

import { signToken } from "../utils/jwt.js";
import { ApiError } from "../middleware/errorHandler.js";

const BCRYPT_SALT_ROUNDS = 12;

const VALID_ROLES = ["admin", "doctor", "user"];

function normalizeEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    return null;
  }

  return email.trim().toLowerCase();
}

function validatePassword(password) {
  return typeof password === "string" && password.length > 0;
}

// Check whether an email is already used by any account type.
async function findAccountsByEmail(email) {
  const [admin, doctor, user] = await Promise.all([
    adminByEmail(email),
    doctorByEmail(email),
    userByEmail(email),
  ]);

  return { admin, doctor, user };
}

// Register an ordinary user.
export const registerUser = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body ?? {};
    const normalizedEmail = normalizeEmail(email);

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      !normalizedEmail ||
      !validatePassword(password)
    ) {
      return next(
        new ApiError(
          400,
          "Full name, valid email, and password are required."
        )
      );
    }

    const existingAccounts = await findAccountsByEmail(normalizedEmail);

    if (
      existingAccounts.user ||
      existingAccounts.doctor ||
      existingAccounts.admin
    ) {
      return next(
        new ApiError(409, "An account with this email already exists.")
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      BCRYPT_SALT_ROUNDS
    );

    const user = await createUser(
      full_name.trim(),
      normalizedEmail,
      passwordHash
    );

    if (!user) {
      return next(new ApiError(500, "Unable to create account."));
    }

    const token = signToken({
      id: user.user_id,
      role: "user",
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: "user",
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Register a doctor; the model/database must set verification to pending.
export const registerDoctor = async (req, res, next) => {
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

    const normalizedEmail = normalizeEmail(email);

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      !normalizedEmail ||
      !validatePassword(password) ||
      !degree?.toString().trim() ||
      !Number.isInteger(Number(graduation_year)) ||
      !college_name?.trim() ||
      !professional_registration_number?.trim() ||
      !registration_authority?.trim() ||
      !workplace?.trim() ||
      !specialization?.trim()
    ) {
      return next(
        new ApiError(
          400,
          "Please provide all required doctor and registration details."
        )
      );
    }

    const existingAccounts = await findAccountsByEmail(normalizedEmail);

    if (
      existingAccounts.user ||
      existingAccounts.doctor ||
      existingAccounts.admin
    ) {
      return next(
        new ApiError(409, "An account with this email already exists.")
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      BCRYPT_SALT_ROUNDS
    );

    const doctor = await createDoctor(
      full_name.trim(),
      normalizedEmail,
      passwordHash,
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

    if (!doctor) {
      return next(
        new ApiError(500, "Unable to create doctor account.")
      );
    }

    const token = signToken({
      id: doctor.doctor_id,
      role: "doctor",
      email: doctor.email,
    });

    return res.status(201).json({
      success: true,
      message:
        "Doctor account created. Your profile is awaiting administrative review.",
      token,
      user: {
        id: doctor.doctor_id,
        fullName: doctor.full_name,
        email: doctor.email,
        role: "doctor",
        verificationStatus: doctor.verification_status,
        createdAt: doctor.created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Unified login for user, doctor, or admin.
export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body ?? {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !validatePassword(password)) {
      return next(
        new ApiError(400, "Valid email and password are required.")
      );
    }

    if (role !== undefined && !VALID_ROLES.includes(role)) {
      return next(new ApiError(400, "Invalid role specified."));
    }

    const findAccount = async (targetRole) => {
      let account;

      if (targetRole === "admin") {
        account = await adminByEmail(normalizedEmail);
        if (!account) return null;

        return {
          ...account,
          id: account.admin_id,
          role: "admin",
        };
      }

      if (targetRole === "doctor") {
        account = await doctorByEmail(normalizedEmail);
        if (!account) return null;

        return {
          ...account,
          id: account.doctor_id,
          role: "doctor",
        };
      }

      account = await userByEmail(normalizedEmail);
      if (!account) return null;

      return {
        ...account,
        id: account.user_id,
        role: "user",
      };
    };

    let account;

    if (role) {
      account = await findAccount(role);
    } else {
      const accounts = await Promise.all(
        VALID_ROLES.map((targetRole) => findAccount(targetRole))
      );

      const matches = accounts.filter(Boolean);

      if (matches.length > 1) {
        return next(
          new ApiError(
            400,
            "Multiple account types match this email. Please select a role."
          )
        );
      }

      account = matches[0] ?? null;
    }

    if (!account) {
      return next(new ApiError(401, "Invalid email or password."));
    }

    const passwordMatches = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!passwordMatches) {
      return next(new ApiError(401, "Invalid email or password."));
    }

    const token = signToken({
      id: account.id,
      role: account.role,
      email: account.email,
    });

    const responseUser = {
      id: account.id,
      fullName: account.full_name,
      email: account.email,
      role: account.role,
    };

    if (account.role === "doctor") {
      responseUser.verificationStatus = account.verification_status;
      responseUser.adminMessage = account.admin_message;
      responseUser.degree = account.degree;
      responseUser.specialization = account.specialization;
      responseUser.workplace = account.workplace;
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: responseUser,
    });
  } catch (error) {
    return next(error);
  }
};

// Get the authenticated account's own profile.
export const getMe = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    let profile;

    if (role === "admin") {
      profile = await getAdminProfile(id);
    } else if (role === "doctor") {
      profile = await getDoctorProfile(id);
    } else if (role === "user") {
      profile = await getUserProfile(id);
    } else {
      return next(new ApiError(403, "Invalid account role."));
    }

    if (!profile) {
      return next(new ApiError(404, "Account not found."));
    }

    return res.status(200).json({
      success: true,
      user: {
        ...profile,
        role,
      },
    });
  } catch (error) {
    return next(error);
  }
};
