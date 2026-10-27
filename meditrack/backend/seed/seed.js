#!/usr/bin/env node
/**
 * MediTrack — isolated development data seeder.
 *
 * Purpose
 * -------
 * Insert a small, clearly-marked set of fictional test records into the five
 * MediTrack tables so local development and manual testing have data to work
 * with:
 *
 *   admins, users, doctors, medication_instructions, medication_schedules
 *
 * Safety rules (full explanation in seed/README.md)
 * -------------------------------------------------
 * - Reset-and-refill: on EVERY run it DELETES the previously-seeded demo rows
 *   and re-inserts the same dataset. Deletion is scoped to demo markers only
 *   (demo.*@example.com emails and "Demo ..." titles / medicine names), so
 *   unrelated or production rows are NEVER touched.
 * - One transaction; rollback on any failure (a failed run changes nothing).
 * - Parameterized SQL only (delete patterns are passed as parameters).
 * - Refuses to run unless the target is positively a local development/test
 *   database (local host + NODE_ENV = development|test).
 * - Fictional data only — no real patient info, no real credentials.
 * - Reuses the backend's connection settings (DB_* in ../.env) and its
 *   password-hashing library (bcrypt). No backend files are modified.
 *
 * Run manually from the backend directory:
 *   node seed/seed.js            # delete old demo data + re-seed (dev-target guard)
 *   node seed/seed.js --dry-run  # read-only plan; makes NO changes
 */

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import pg from "pg";
import bcrypt from "bcrypt"; // NOTE: the backend uses native `bcrypt`, NOT `bcryptjs`.

const { Pool } = pg;

// ---------------------------------------------------------------------------
// Load the backend .env explicitly so the seeder works no matter the CWD.
// From seed/seed.js, ../.env resolves to <backend>/.env.
// ---------------------------------------------------------------------------
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

// ---------------------------------------------------------------------------
// Connection settings — mirror src/config/db.js EXACTLY.
// The backend does NOT use DATABASE_URL; it uses these DB_* variables.
// We only read them here; we never change .env or db.js.
// ---------------------------------------------------------------------------
const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5435),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// ---------------------------------------------------------------------------
// Safety gate: only run against a database we can positively identify as a
// local development/test database. Otherwise refuse before ever connecting.
// ---------------------------------------------------------------------------
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "0.0.0.0"];
const DEV_ENVS = ["development", "test"];

function assertDevTestTarget() {
  const problems = [];

  if (!config.database) {
    problems.push("DB_NAME is not set (target database cannot be identified)");
  }
  if (!LOCAL_HOSTS.includes(config.host)) {
    problems.push(
      `DB_HOST="${config.host ?? "(unset)"}" is not a local host (expected localhost / 127.0.0.1)`,
    );
  }
  if (!DEV_ENVS.includes(process.env.NODE_ENV)) {
    problems.push(
      `NODE_ENV="${process.env.NODE_ENV ?? "(unset)"}" is not a development/test environment`,
    );
  }

  if (problems.length > 0) {
    console.error("\n==========================================================");
    console.error(" REFUSED: target does not look like a local dev/test DB.");
    console.error("==========================================================");
    for (const p of problems) console.error("  - " + p);
    console.error(" Point ../.env at your local development database (local");
    console.error(" host) and set NODE_ENV=development (or test), then re-run.");
    console.error(" See seed/README.md for details.");
    console.error("==========================================================\n");
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Fictional, clearly-marked test data. 10 records per table.
// ---------------------------------------------------------------------------
const DEMO_PASSWORD = "DemoPass123!"; // fictional password for throwaway test accounts only

const admins = Array.from({ length: 10 }, (_, i) => ({
  full_name: `Demo Admin ${i + 1}`,
  email: `demo.admin${i + 1}@example.com`,
}));

const users = Array.from({ length: 10 }, (_, i) => ({
  full_name: `Demo User ${i + 1}`,
  email: `demo.user${i + 1}@example.com`,
}));

const doctors = Array.from({ length: 10 }, (_, i) => ({
  full_name: `Demo Doctor ${i + 1}`,
  email: `demo.doctor${i + 1}@example.com`,
  degree: "MBBS - TEST DATA",
  graduation_year: 2015 + i,
  college_name: `Fictional Test College ${i + 1}`,
  professional_registration_number: `TEST-REG-${String(i + 1).padStart(3, "0")}`,
  registration_authority: "FICTIONAL TEST AUTHORITY",
  registration_document_url: null,
  workplace: `Fictional Test Clinic ${i + 1}`,
  specialization: [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "ENT",
    "Ophthalmology",
    "Endocrinology",
    "General Medicine",
  ][i],
  public_phone: null,
  social_media_url: null,
  // Full state space so admin-review flows can be exercised. This does NOT
  // bypass verification: public listing still requires 'approved'.
  verification_status: [
    "approved",
    "pending",
    "approved",
    "rejected",
    "pending",
    "approved",
    "suspended",
    "pending",
    "approved",
    "pending",
  ][i],
}));

// Only 'approved' doctors may own a published/withdrawn record; every other
// doctor's seeded instruction is stored as 'draft'. This guarantees the seed
// never attributes public content to an unverified doctor.
const RAW_PUBLICATION = [
  "published", "draft", "published", "published", "withdrawn",
  "draft", "published", "published", "draft", "published",
];

const instructions = Array.from({ length: 10 }, (_, i) => ({
  condition_name: [
    "Common Cold",
    "Seasonal Allergies",
    "Migraine",
    "Type 2 Diabetes",
    "Hypertension",
    "Acid Reflux",
    "Eczema",
    "Asthma",
    "Iron Deficiency",
    "Osteoarthritis",
  ][i],
  title: `Demo Educational Instruction ${i + 1}`,
  medical_overview:
    "Fictional educational content for testing the application only. " +
    "This is not medical advice.",
  medicine_name: `Demo Medicine ${i + 1} - NOT FOR USE`,
  general_usage_information:
    "Placeholder text. No dosage or treatment instructions are provided. " +
    "Consult a qualified healthcare professional for personal medical advice.",
  safety_warnings:
    "TEST DATA ONLY. Do not use this record to guide medication decisions.",
  when_to_seek_care:
    "For real symptoms or urgent concerns, contact an appropriate healthcare professional.",
  publication_status:
    doctors[i].verification_status === "approved" ? RAW_PUBLICATION[i] : "draft",
}));

const schedules = Array.from({ length: 10 }, (_, i) => ({
  medicine_name: `Demo Schedule Medicine ${i + 1}`,
  dosage_instructions: "TEST DATA ONLY - not a real dosage instruction.",
  // reminder_times lands in the existing TIME[] column; each has 1+ times.
  reminder_times: [
    ["08:00:00", "20:00:00"],
    ["09:00:00"],
    ["08:00:00", "14:00:00", "20:00:00"],
    ["07:30:00", "19:30:00"],
    ["10:00:00"],
    ["08:00:00", "16:00:00", "22:00:00"],
    ["09:30:00", "21:30:00"],
    ["07:00:00", "19:00:00"],
    ["12:00:00"],
    ["08:00:00", "20:00:00"],
  ][i],
  start_date: "2026-01-01",
  end_date: "2026-01-30",
}));

// ---------------------------------------------------------------------------
// Reset: which previously-seeded demo rows to remove before re-seeding.
// Children are deleted before their owners so FK integrity holds. The patterns
// are parameterized; ONLY these demo markers are ever targeted.
// ---------------------------------------------------------------------------
const RESET_RULES = [
  { table: "medication_schedules", column: "medicine_name", pattern: "Demo Schedule Medicine%" },
  { table: "medication_instructions", column: "title", pattern: "Demo Educational Instruction%" },
  { table: "doctors", column: "email", pattern: "demo.doctor%@example.com" },
  { table: "users", column: "email", pattern: "demo.user%@example.com" },
  { table: "admins", column: "email", pattern: "demo.admin%@example.com" },
];

/**
 * Remove the previously-seeded demo rows (children first, then owners).
 * Write mode runs DELETE; dry-run reports how many would be removed.
 * Only demo-marker rows are targeted — nothing else is touched.
 * Returns the number of rows deleted (write) or that would be deleted (dry-run).
 */
async function resetDemoData(client, write) {
  let total = 0;
  console.log(
    write
      ? "\nreset: deleting existing demo rows..."
      : "\nreset: rows that would be deleted...",
  );
  for (const { table, column, pattern } of RESET_RULES) {
    if (write) {
      const res = await client.query(
        `DELETE FROM ${table} WHERE ${column} LIKE $1`,
        [pattern],
      );
      total += res.rowCount;
      console.log(`  ${res.rowCount} ${table} (${column} LIKE '${pattern}')`);
    } else {
      const cnt = await client.query(
        `SELECT COUNT(*) AS n FROM ${table} WHERE ${column} LIKE $1`,
        [pattern],
      );
      const n = Number(cnt.rows[0].n);
      total += n;
      console.log(`  would delete ${n} ${table} (${column} LIKE '${pattern}')`);
    }
  }
  return total;
}

// ---------------------------------------------------------------------------
// Idempotent find-or-create helpers.
// ---------------------------------------------------------------------------

/**
 * Find-or-create an identity row keyed by UNIQUE email.
 * Reuses an existing row (never overwrites) and returns { id, created, would }.
 * In dry-run mode, existing rows are read; new rows are only reported, not written.
 */
async function ensureByEmail(
  client,
  write,
  table,
  idColumn,
  email,
  insertSql,
  params,
) {
  const existing = await client.query(
    `SELECT ${idColumn} FROM ${table} WHERE email = $1 LIMIT 1`,
    [email],
  );
  if (existing.rows.length > 0) {
    return { id: existing.rows[0][idColumn], created: false };
  }
  if (!write) {
    return { id: null, created: true, would: true };
  }
  const inserted = await client.query(insertSql, params);
  if (inserted.rows.length > 0) {
    return { id: inserted.rows[0][idColumn], created: true };
  }
  // Defensive: a row with this email already exists (e.g. created between the
  // SELECT and the INSERT). Re-read so the FK target is always valid.
  const recheck = await client.query(
    `SELECT ${idColumn} FROM ${table} WHERE email = $1 LIMIT 1`,
    [email],
  );
  return { id: recheck.rows[0][idColumn], created: true };
}

/** Find-or-create a medication instruction keyed by (doctor_id, title). */
async function ensureInstruction(client, write, doctorId, instr) {
  const existing = await client.query(
    `SELECT instruction_id FROM medication_instructions
     WHERE doctor_id = $1 AND title = $2 LIMIT 1`,
    [doctorId, instr.title],
  );
  if (existing.rows.length > 0) {
    return { id: existing.rows[0].instruction_id, created: false };
  }
  if (!write) {
    return { id: null, created: true, would: true };
  }
  await client.query(
    `INSERT INTO medication_instructions (
       doctor_id, condition_name, title, medical_overview, medicine_name,
       general_usage_information, safety_warnings, when_to_seek_care,
       publication_status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      doctorId,
      instr.condition_name,
      instr.title,
      instr.medical_overview,
      instr.medicine_name,
      instr.general_usage_information,
      instr.safety_warnings,
      instr.when_to_seek_care,
      instr.publication_status,
    ],
  );
  return { created: true };
}

/** Find-or-create a medication schedule keyed by (user_id, medicine_name). */
async function ensureSchedule(client, write, userId, sched) {
  const existing = await client.query(
    `SELECT schedule_id FROM medication_schedules
     WHERE user_id = $1 AND medicine_name = $2 LIMIT 1`,
    [userId, sched.medicine_name],
  );
  if (existing.rows.length > 0) {
    return { id: existing.rows[0].schedule_id, created: false };
  }
  if (!write) {
    return { id: null, created: true, would: true };
  }
  await client.query(
    `INSERT INTO medication_schedules (
       user_id, medicine_name, dosage_instructions,
       reminder_times, start_date, end_date
     )
     VALUES ($1, $2, $3, $4::time[], $5, $6)`,
    [
      userId,
      sched.medicine_name,
      sched.dosage_instructions,
      sched.reminder_times,
      sched.start_date,
      sched.end_date,
    ],
  );
  return { created: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const write = !process.argv.includes("--dry-run");
  const dryRun = !write;

  // Refuse before connecting if the target is not a local dev/test DB.
  assertDevTestTarget();

  console.log(
    `Target: ${config.user ?? "?"}@${config.host ?? "?"}:${config.port}/` +
      `${config.database ?? "?"}  (NODE_ENV=${process.env.NODE_ENV ?? "?"})`,
  );
  console.log(dryRun ? "Mode: --dry-run (read-only plan, no changes)" : "Mode: seed (reset + re-seed)");

  const pool = new Pool(config);
  pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
  });

  // Connect (outside the write transaction so a connection failure is clean).
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error("Could not connect to the database:", err.message);
    await pool.end();
    process.exit(1);
  }

  const tally = { created: 0, existing: 0 };
  const mark = (r) => (r.created ? tally.created++ : tally.existing++);
  const label = (r) =>
    r.created ? (r.would ? "  [would create]" : "  (created)") : "  (existing)";

  try {
    const cur = await client.query("SELECT current_database() AS db");
    console.log(`Connected to database: "${cur.rows[0].db}"`);

    if (!dryRun) await client.query("BEGIN");

    // 0) Reset: delete any previously-seeded demo rows (scoped to demo markers,
    //     children before owners) so this run re-fills the same clean dataset.
    const resetCount = await resetDemoData(client, write);

    // Hash the demo password once (bcrypt, matching the backend) and reuse it
    // for every throwaway test account.
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // 1) Admins
    console.log("\nadmins:");
    for (const a of admins) {
      const r = await ensureByEmail(
        client, write, "admins", "admin_id", a.email,
        `INSERT INTO admins (full_name, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING admin_id`,
        [a.full_name, a.email, passwordHash],
      );
      console.log(`  ${a.email}${label(r)} -> id ${r.id ?? "-"}`);
      mark(r);
    }

    // 2) Users
    const userRowIds = [];
    console.log("\nusers:");
    for (const u of users) {
      const r = await ensureByEmail(
        client, write, "users", "user_id", u.email,
        `INSERT INTO users (full_name, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING user_id`,
        [u.full_name, u.email, passwordHash],
      );
      userRowIds.push(r.id);
      console.log(`  ${u.email}${label(r)} -> id ${r.id ?? "-"}`);
      mark(r);
    }

    // 3) Doctors
    const doctorRowIds = [];
    console.log("\ndoctors:");
    for (const d of doctors) {
      const r = await ensureByEmail(
        client, write, "doctors", "doctor_id", d.email,
        `INSERT INTO doctors (
           full_name, email, password_hash, degree, graduation_year,
           college_name, professional_registration_number,
           registration_authority, registration_document_url,
           workplace, specialization, public_phone, social_media_url,
           verification_status
         )
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (email) DO NOTHING
         RETURNING doctor_id`,
        [
          d.full_name, d.email, passwordHash, d.degree, d.graduation_year,
          d.college_name, d.professional_registration_number,
          d.registration_authority, d.registration_document_url,
          d.workplace, d.specialization, d.public_phone, d.social_media_url,
          d.verification_status,
        ],
      );
      doctorRowIds.push(r.id);
      console.log(`  ${d.email} [${d.verification_status}]${label(r)} -> id ${r.id ?? "-"}`);
      mark(r);
    }

    // 4) Medication instructions — each references doctor #i (existing FK).
    console.log("\nmedication_instructions:");
    for (let i = 0; i < instructions.length; i++) {
      const r = await ensureInstruction(client, write, doctorRowIds[i], instructions[i]);
      console.log(
        `  "${instructions[i].title}" [${instructions[i].publication_status}]${label(r)}` +
          ` -> doctor ${doctorRowIds[i] ?? "-"}`,
      );
      mark(r);
    }

    // 5) Private medication schedules — each references user #i (existing FK),
    //    with 1+ reminder times in the TIME[] column.
    console.log("\nmedication_schedules:");
    for (let i = 0; i < schedules.length; i++) {
      const r = await ensureSchedule(client, write, userRowIds[i], schedules[i]);
      console.log(
        `  "${schedules[i].medicine_name}" (${schedules[i].reminder_times.length} reminders)${label(r)}` +
          ` -> user ${userRowIds[i] ?? "-"}`,
      );
      mark(r);
    }

    if (!dryRun) await client.query("COMMIT");

    console.log("\n--------------------------------------------------");
    if (dryRun) {
      console.log(
        `Dry run complete. Would delete ${resetCount} existing demo row(s) ` +
          `and re-create ${tally.created}. No changes were made.`,
      );
    } else {
      console.log(
        `Seed complete. Reset ${resetCount} old demo row(s) and re-created ` +
          `${tally.created} new record(s)${tally.existing ? `; ${tally.existing} pre-existing kept` : ""}.`,
      );
      console.log(`10 records per table: admins, users, doctors, instructions, schedules.`);
      console.log(`Demo password for all accounts: ${DEMO_PASSWORD}  (test data only)`);
    }
    console.log("All records are fictional test data; only demo rows were reset.");
  } catch (error) {
    if (!dryRun) {
      try {
        await client.query("ROLLBACK");
        console.error("\nSeed failed. Transaction rolled back:", error.message);
      } catch (rollbackError) {
        console.error("\nSeed failed and rollback also failed:", rollbackError.message);
      }
    } else {
      console.error("\nDry run failed (read-only, nothing was changed):", error.message);
    }
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
