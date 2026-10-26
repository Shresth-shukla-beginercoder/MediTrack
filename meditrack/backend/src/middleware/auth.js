
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "./errorHandler.js";
import pool from "../config/db.js";

/**
 * Authentication Middleware:
 * Validates the JWT Bearer token and attaches decoded user identity to req.user.
 */
export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "Authentication required. No token provided.")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    // Attach authenticated identity to the request.
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    // Central error handler catches invalid or expired tokens.
    next(err);
  }
};

/**
 * Role-Based Authorization Middleware:
 * Restricts access to one or more authorized roles.
 *
 * @param {...string} allowedRoles - e.g. "admin", "doctor", "user"
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Requires one of: [${allowedRoles.join(", ")}].`
        )
      );
    }

    next();
  };
};

/**
 * Doctor Approval Authorization Middleware:
 * Checks the doctor's current verification status in the database.
 * Prevents pending, rejected, or suspended doctors from performing
 * actions that require approval.
 */
export const requireApprovedDoctor = async (req, res, next) => {
  if (!req.user || req.user.role !== "doctor") {
    return next(
      new ApiError(403, "Access denied. Doctor identity required.")
    );
  }

  try {
    const docRes = await pool.query(
      `SELECT doctor_id, verification_status, admin_message
       FROM doctors
       WHERE doctor_id = $1`,
      [req.user.id]
    );

    if (docRes.rows.length === 0) {
      return next(new ApiError(404, "Doctor profile not found."));
    }

    const doctor = docRes.rows[0];

    if (doctor.verification_status !== "approved") {
      const messages = {
        pending:
          "Your doctor profile is currently pending administrator verification. You cannot publish content yet.",
        rejected: `Your doctor application was rejected by the administrator.${
          doctor.admin_message
            ? " Reason: " + doctor.admin_message
            : ""
        }`,
        suspended: `Your doctor publishing privileges have been suspended.${
          doctor.admin_message
            ? " Notice: " + doctor.admin_message
            : ""
        }`,
      };

      const reason =
        messages[doctor.verification_status] ||
        "Doctor account is not authorized to perform this action.";

      return next(new ApiError(403, reason));
    }

    req.doctorStatus = doctor.verification_status;

    return next();
  } catch (err) {
    return next(err);
  }
};
