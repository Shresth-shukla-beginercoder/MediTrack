
import pool from "../config/db.js";




export async function createDoctor(
   full_name,
  email,
  password_hash,
  degree,
  graduation_year,
  college_name,
  professional_registration_number,
  registration_authority,
  registration_document_url,
  workplace,
  specialization,
  public_phone,
  social_media_url
) {
  const result = await pool.query(
    `INSERT INTO doctors (
      full_name,
  email,
  password_hash,
  degree,
  graduation_year,
  college_name,
  professional_registration_number,
  registration_authority,
  registration_document_url,
  workplace,
  specialization,
  public_phone,
  social_media_url
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,$13
    )
    RETURNING *`,
    [
      full_name,
  email,
  password_hash,
  degree,
  graduation_year,
  college_name,
  professional_registration_number,
  registration_authority,
  registration_document_url,
  workplace,
  specialization,
  public_phone,
  social_media_url
    ]
  );

  return result.rows[0] || null;
}

// Find doctor by email
export async function doctorByEmail(email) {
  const result = await pool.query(
    `SELECT *
     FROM doctors
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

// Get doctor profile without password hash
export async function getDoctorProfile(id) {
  const result = await pool.query(
    `SELECT
       doctor_id,
       full_name,
       email,
       degree,
       graduation_year,
       college_name,
       professional_registration_number,
       registration_authority,
       workplace,
       specialization,
       public_phone,
       social_media_url,
       verification_status,
       created_at
     FROM doctors
     WHERE doctor_id = $1`,
    [id]
  );

  return result.rows[0] || null;
}


export async function updateDoctorProfile(
  full_name,
  registration_authority,
  workplace,
  specialization,
  public_phone,
  social_media_url,
  doctor_id
) {
  const result = await pool.query(
    `UPDATE doctors
     SET
       full_name = $1,
       registration_authority = $2,
       workplace = $3,
       specialization = $4,
       public_phone = $5,
       social_media_url = $6
     WHERE doctor_id = $7
     RETURNING *`,
    [
      full_name,
      registration_authority,
      workplace,
      specialization,
      public_phone,
      social_media_url,
      doctor_id
    ]
  );

  return result.rows[0] || null;
}

export async function updateDoctorCredentials(id, data) {
  const {
    degree,
    graduation_year,
    college_name,
    professional_registration_number,
    registration_authority,
    registration_document_url
  } = data;

  const result = await pool.query(
    `UPDATE doctors
     SET degree = $1,
         graduation_year = $2,
         college_name = $3,
         professional_registration_number = $4,
         registration_authority = $5,
         registration_document_url = $6
     WHERE doctor_id = $7
     RETURNING *`,
    [
      degree,
      graduation_year,
      college_name,
      professional_registration_number,
      registration_authority,
      registration_document_url,
      id
    ]
  );

  return result.rows[0] || null;
}


export async function getDoctorVerificationStatus(id) {
  const result = await pool.query(
    `SELECT doctor_id, verification_status, admin_message,
            reviewed_at
     FROM doctors
     WHERE doctor_id = $1`,
    [id]
  );

  return result.rows[0] || null;
}


export async function getDoctorInstructions(id) {
  const result = await pool.query(
    `SELECT *
     FROM medication_instructions
     WHERE doctor_id = $1
     ORDER BY created_at DESC`,
    [id]
  );

  return result.rows;
}

export async function updateDoctorStatus(
  id,
  status,
  adminId,
  adminMessage = null
) {
  const allowedStatuses = [
    "pending",
    "approved",
    "rejected",
    "suspended",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid doctor verification status");
  }

  const result = await pool.query(
    `UPDATE doctors
     SET verification_status = $1,
         admin_message = $2,
         reviewed_by_admin_id = $3,
         reviewed_at = CURRENT_TIMESTAMP
     WHERE doctor_id = $4
     RETURNING doctor_id, full_name, email,
               verification_status, admin_message,
               reviewed_by_admin_id, reviewed_at`,
    [status, adminMessage, adminId, id]
  );

  return result.rows[0] || null;
}