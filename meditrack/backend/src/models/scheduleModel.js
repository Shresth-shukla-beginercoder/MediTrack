
import pool from "../config/db.js";

// 1. Create a medication schedule
export async function createSchedule(
  user_id,
  medicine_name,
  dosage_instructions,
  reminder_times,
  start_date,
  end_date
) {
  const result = await pool.query(
    `INSERT INTO medication_schedules (
      user_id,
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      user_id,
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date
    ]
  );

  return result.rows[0] || null;
}

// 2. Get all schedules belonging to one user
export async function getUserSchedules(user_id) {
  const result = await pool.query(
    `SELECT *
     FROM medication_schedules
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id]
  );

  return result.rows;
}

// 3. Find one schedule belonging to one user
export async function scheduleByID(schedule_id, user_id) {
  const result = await pool.query(
    `SELECT *
     FROM medication_schedules
     WHERE schedule_id = $1
       AND user_id = $2`,
    [schedule_id, user_id]
  );

  return result.rows[0] || null;
}

// 4. Update a user's own schedule
export async function updateSchedule(
  schedule_id,
  user_id,
  data
) {
  const {
    medicine_name,
    dosage_instructions,
    reminder_times,
    start_date,
    end_date
  } = data;

  const result = await pool.query(
    `UPDATE medication_schedules
     SET medicine_name = $1,
         dosage_instructions = $2,
         reminder_times = $3,
         start_date = $4,
         end_date = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE schedule_id = $6
       AND user_id = $7
     RETURNING *`,
    [
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date,
      schedule_id,
      user_id
    ]
  );

  return result.rows[0] || null;
}

// 5. Delete a user's own schedule
export async function deleteSchedule(schedule_id, user_id) {
  const result = await pool.query(
    `DELETE FROM medication_schedules
     WHERE schedule_id = $1
       AND user_id = $2
     RETURNING schedule_id`,
    [schedule_id, user_id]
  );

  return result.rows[0] || null;
}
