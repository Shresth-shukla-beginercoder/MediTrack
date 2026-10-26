import pool from "../config/db.js";

// 1. Find a user by email (used during login)
export async function userByEmail(email) {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

// 2. Find a user by ID
export async function userByID(id) {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE user_id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
}

// 3. Create a new user account
export async function createUser(full_name, email, password_hash) {
  const result = await pool.query(
    `INSERT INTO users (
      full_name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    RETURNING user_id, full_name, email, created_at`,
    [full_name, email, password_hash]
  );

  return result.rows[0] || null;
}

// 4. Get a user's profile
export async function getUserProfile(id) {
  const result = await pool.query(
    `SELECT
      user_id,
      full_name,
      email,
      created_at
     FROM users
     WHERE user_id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

// 5. Update a user's profile
export async function updateUserProfile(id, full_name, email) {
  const result = await pool.query(
    `UPDATE users
     SET full_name = $1,
         email = $2
     WHERE user_id = $3
     RETURNING user_id, full_name, email, created_at`,
    [full_name, email, id]
  );

  return result.rows[0] || null;
}