
import pool from "../config/db.js";

// 1. Create a medication instruction draft.
export async function createInstruction(
  doctor_id,
  condition_name,
  title,
  medical_overview,
  medicine_name,
  general_usage_information,
  safety_warnings,
  when_to_seek_care
) {
  const result = await pool.query(
    `INSERT INTO medication_instructions (
       doctor_id,
       condition_name,
       title,
       medical_overview,
       medicine_name,
       general_usage_information,
       safety_warnings,
       when_to_seek_care
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      doctor_id,
      condition_name,
      title,
      medical_overview,
      medicine_name,
      general_usage_information,
      safety_warnings,
      when_to_seek_care,
    ]
  );

  return result.rows[0] || null;
}

// 2. Find an instruction belonging to a specific doctor.
export async function instructionByID(id, doctor_id) {
  const result = await pool.query(
    `SELECT *
     FROM medication_instructions
     WHERE instruction_id = $1
       AND doctor_id = $2`,
    [id, doctor_id]
  );

  return result.rows[0] || null;
}

// 3. Get instructions belonging to one doctor.
export async function getDoctorInstructions(doctor_id) {
  const result = await pool.query(
    `SELECT *
     FROM medication_instructions
     WHERE doctor_id = $1
     ORDER BY created_at DESC`,
    [doctor_id]
  );

  return result.rows;
}


/* 4. Update an instruction belonging to its doctor. */
export async function updateInstruction(instruction_id, doctor_id, data) {
  const current = await instructionByID(instruction_id, doctor_id);

  if (!current) return null;

  const {
    condition_name = current.condition_name,
    title = current.title,
    medical_overview = current.medical_overview,
    medicine_name = current.medicine_name,
    general_usage_information = current.general_usage_information,
    safety_warnings = current.safety_warnings,
    when_to_seek_care = current.when_to_seek_care,
  } = data;

  const result = await pool.query(
    `UPDATE medication_instructions
     SET condition_name = $1,
         title = $2,
         medical_overview = $3,
         medicine_name = $4,
         general_usage_information = $5,
         safety_warnings = $6,
         when_to_seek_care = $7,
         updated_at = CURRENT_TIMESTAMP
     WHERE instruction_id = $8
       AND doctor_id = $9
     RETURNING *`,
    [
      condition_name,
      title,
      medical_overview,
      medicine_name,
      general_usage_information,
      safety_warnings,
      when_to_seek_care,
      instruction_id,
      doctor_id,
    ]
  );

  return result.rows[0] || null;
}

// 5. Delete an instruction belonging to its doctor.
export async function deleteInstruction(instruction_id, doctor_id) {
  const result = await pool.query(
    `DELETE FROM medication_instructions
     WHERE instruction_id = $1
       AND doctor_id = $2
     RETURNING instruction_id`,
    [instruction_id, doctor_id]
  );

  return result.rows[0] || null;
}

// 6. Publish or withdraw an instruction owned by the doctor.
export async function updateInstructionPublication(
  instruction_id,
  doctor_id,
  publication_status
) {
  const result = await pool.query(
    `UPDATE medication_instructions
     SET publication_status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE instruction_id = $2
       AND doctor_id = $3
     RETURNING *`,
    [publication_status, instruction_id, doctor_id]
  );

  return result.rows[0] || null;
}

// 7. Get all published instructions from approved doctors.
export async function getPublishedInstructions() {
  const result = await pool.query(
    `SELECT
       mi.instruction_id,
       mi.doctor_id,
       mi.condition_name,
       mi.title,
       mi.medical_overview,
       mi.medicine_name,
       mi.general_usage_information,
       mi.safety_warnings,
       mi.when_to_seek_care,
       mi.publication_status,
       mi.created_at,
       mi.updated_at,
       d.full_name AS doctor_name,
       d.workplace,
       d.specialization
     FROM medication_instructions AS mi
     JOIN doctors AS d
       ON d.doctor_id = mi.doctor_id
     WHERE mi.publication_status = 'published'
       AND d.verification_status = 'approved'
     ORDER BY mi.created_at DESC`
  );

  return result.rows;
}

// 8. Get one published instruction by ID.
export async function getPublishedInstructionById(instructionId) {
  const result = await pool.query(
    `SELECT
       mi.instruction_id,
       mi.doctor_id,
       mi.condition_name,
       mi.title,
       mi.medical_overview,
       mi.medicine_name,
       mi.general_usage_information,
       mi.safety_warnings,
       mi.when_to_seek_care,
       mi.created_at,
       mi.updated_at,
       d.full_name AS doctor_name,
       d.workplace,
       d.specialization
     FROM medication_instructions AS mi
     JOIN doctors AS d
       ON d.doctor_id = mi.doctor_id
     WHERE mi.instruction_id = $1
       AND mi.publication_status = 'published'
       AND d.verification_status = 'approved'
     LIMIT 1`,
    [instructionId]
  );

  return result.rows[0] || null;
}
