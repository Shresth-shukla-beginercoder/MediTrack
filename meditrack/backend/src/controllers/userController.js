
import {
  userByEmail,
  userByID,
  createUser as createUserModel,
  getUserProfile,
  updateUserProfile as updateUserProfileModel
} from "../models/userModel.js";

import bcrypt from "bcrypt";
import { ApiError } from "../middleware/errorHandler.js";

// 1. Find a user by email
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return next(new ApiError(400, "Email is required."));
    }

    const user = await userByEmail(email.trim());

    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully.",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Find a user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userByID(id);

    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully.",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Create a new user account
export const createUser = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return next(
        new ApiError(400, "Full name, email, and password are required.")
      );
    }

    const existingUser = await userByEmail(email.trim());

    if (existingUser) {
      return next(
        new ApiError(409, "An account with this email already exists.")
      );
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await createUserModel(
      full_name.trim(),
      email.trim(),
      password_hash
    );

    return res.status(201).json({
      success: true,
      message: "User account created successfully.",
      user
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get the logged-in user's profile
export const getMyUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getUserProfile(userId);

    if (!user) {
      return next(new ApiError(404, "User profile not found."));
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully.",
      user
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update the logged-in user's profile
export const updateMyUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;

    if (!full_name?.trim() || !email?.trim()) {
      return next(
        new ApiError(400, "Full name and email are required.")
      );
    }

    const user = await updateUserProfileModel(
      userId,
      full_name.trim(),
      email.trim()
    );

    if (!user) {
      return next(new ApiError(404, "User profile not found."));
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user
    });
  } catch (error) {
    next(error);
  }
};
