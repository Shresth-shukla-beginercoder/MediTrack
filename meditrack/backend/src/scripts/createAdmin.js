import bcrypt from 'bcrypt';
import readline from 'readline';
import { query, pool } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

function promptInput(questionText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(questionText, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * One-time setup script to securely create an Administrator account.
 * Supports interactive prompting or CLI arguments or env vars.
 */
async function createAdmin() {
  const args = process.argv.slice(2);

  let fullName = args[0] || process.env.ADMIN_NAME;
  let email = args[1] || process.env.ADMIN_EMAIL;
  let password = args[2] || process.env.ADMIN_PASSWORD;

  console.log('--- MediTrack Administrator Setup ---');

  if (!fullName) {
    fullName = await promptInput('Enter Admin Full Name (default: System Administrator): ');
    if (!fullName) fullName = 'System Administrator';
  }

  if (!email) {
    email = await promptInput('Enter Admin Email (e.g., admin@meditrack.local): ');
  }

  if (!password) {
    password = await promptInput('Enter Secure Admin Password (min 8 chars): ');
  }

  if (!email || !password) {
    console.error('\n Error: Email and password are required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\n Error: Password must be at least 8 characters long for security.');
    process.exit(1);
  }

  try {
    // 1. Check if an admin with this email already exists
    const existing = await query('SELECT admin_id, email FROM admins WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      console.error(`\n Error: An administrator with email "${email}" already exists (admin_id: ${existing.rows[0].admin_id}).`);
      process.exit(1);
    }

    // 2. Hash password with bcrypt (salt rounds = 12 for high security)
    console.log('\nHashing password securely with bcrypt (12 salt rounds)...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert new admin
    const insertRes = await query(
      `INSERT INTO admins (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING admin_id, full_name, email, created_at;`,
      [fullName.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const created = insertRes.rows[0];
    console.log('\n Administrator account successfully created!');
    console.log(`  - Admin ID:   ${created.admin_id}`);
    console.log(`  - Full Name:  ${created.full_name}`);
    console.log(`  - Email:      ${created.email}`);
    console.log(`  - Created At: ${created.created_at}`);
    console.log('\nKeep your credentials safe. Password hash is stored securely.');
  } catch (err) {
    console.error('\n Failed to create admin account:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
