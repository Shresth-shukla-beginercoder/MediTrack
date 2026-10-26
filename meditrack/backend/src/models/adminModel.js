
import pool from "../config/db.js";

// Find an admin by email for login.
export async function adminByEmail(email) {
  const result = await pool.query(
    `SELECT admin_id, full_name, email, password_hash
     FROM admins
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

// Get the logged-in admin's safe profile.
export async function getAdminProfile(adminId) {
  const result = await pool.query(
    `SELECT admin_id, full_name, email, created_at
     FROM admins
     WHERE admin_id = $1
     LIMIT 1`,
    [adminId]
  );

  return result.rows[0] || null;
}

// List doctors, optionally filtered by verification status.
export async function getAllDoctorsForAdmin(status = null) {
  const result = await pool.query(
    `SELECT
       doctor_id, full_name, email, degree,
       graduation_year, college_name,
       professional_registration_number,
       registration_authority, registration_document_url,
       workplace, specialization, verification_status,
       admin_message, reviewed_by_admin_id, reviewed_at,
       created_at
     FROM doctors
     WHERE ($1::text IS NULL OR verification_status = $1)
     ORDER BY created_at DESC`,
    [status]
  );

  return result.rows;
}

// Get one doctor's details without exposing password_hash.
export async function getDoctorByIdForAdmin(doctorId) {
  const result = await pool.query(
    `SELECT
       doctor_id, full_name, email, degree,
       graduation_year, college_name,
       professional_registration_number,
       registration_authority, registration_document_url,
       workplace, specialization, public_phone,
       social_media_url, verification_status,
       admin_message, reviewed_by_admin_id, reviewed_at,
       created_at
     FROM doctors
     WHERE doctor_id = $1
     LIMIT 1`,
    [doctorId]
  );

  return result.rows[0] || null;
}
