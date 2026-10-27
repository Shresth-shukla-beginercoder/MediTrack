#!/usr/bin/env node
/**
 * MediTrack — isolated development data seeder.
 *
 * Purpose
 * -------
 * Insert a small, clearly-marked set of fictional test records into four
 * MediTrack tables so local development and manual testing have data to work
 * with:
 *
 *   users, doctors, medication_instructions, medication_schedules
 *
 * The `admins` table is intentionally left completely untouched.
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
// Fictional, clearly-marked test data.
//   2 users, 10 doctors (all 'approved'), 10 published educational
//   instructions, 10 schedules (clearly marked as test data only).
//   The admins table is NOT touched by this seeder.
// ---------------------------------------------------------------------------
const DEMO_PASSWORD = "DemoPass123!"; // fictional password for throwaway test accounts only

// Only 2 demo users are required. The reset pattern 'demo.user%@example.com'
// still matches demo.user1–10, so users from older seed runs are cleaned up.
const users = [
  { full_name: "Demo User 1", email: "demo.user1@example.com" },
  { full_name: "Demo User 2", email: "demo.user2@example.com" },
];

// All demo doctors are 'approved' so the 10 published educational instructions
// can be owned WITHOUT bypassing the app's authorization rules (public content
// requires an 'approved' doctor). They are explicitly labelled fictional —
// demo accounts, not real doctors.
const doctors = Array.from({ length: 10 }, (_, i) => ({
  full_name: `Demo Doctor ${i + 1}`,
  email: `demo.doctor${i + 1}@example.com`,
  degree: "MBBS - FICTIONAL TEST DATA (not a real doctor)",
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
  verification_status: "approved",
}));

// 10 common conditions with real generic medicine names and simple, reliable,
// medically accurate EDUCATIONAL content, with source links (CDC, MedlinePlus,
// NICE, GINA, NIH, etc.). No doses, medication schedules, or guaranteed
// recovery times are prescribed — only well-established general patterns are
// described. Every record is clearly labelled as fictional demo content that
// is NOT a real prescription or advice from a genuine doctor.
const FULL_DISCLAIMER =
  " FICTIONAL DEMO RECORD - educational content only; NOT a real prescription " +
  "and NOT medical advice from a genuine doctor.";
const SHORT_DISCLAIMER = " Fictional test data - not medical advice.";

const RAW_PUBLICATION = Array(10).fill("published");

const edu = ({ n, condition, condition_name, medicine_name, overview, usage, safety, seekCare }) => ({
  condition_name,
  title: `Demo Educational Instruction ${n} - ${condition} (educational only)`,
  medical_overview: overview + FULL_DISCLAIMER,
  medicine_name,
  general_usage_information: usage + SHORT_DISCLAIMER,
  safety_warnings: safety + SHORT_DISCLAIMER,
  when_to_seek_care: seekCare + SHORT_DISCLAIMER,
  publication_status:
    doctors[n - 1].verification_status === "approved" ? RAW_PUBLICATION[n - 1] : "draft",
});

const instructions = [
  edu({
    n: 1,
    condition: "Common Cold",
    condition_name: "Common Cold (viral upper respiratory infection)",
    medicine_name: "Paracetamol (acetaminophen)",
    overview:
      "A self-limiting viral infection of the upper airways (runny nose, sore throat, low-grade " +
      "fever). No routine antiviral treatment is indicated; symptoms typically improve over 7-10 " +
      "days, though a cough can linger a few weeks. Sources: CDC " +
      "https://www.cdc.gov/common-cold/about/index.html ; MedlinePlus " +
      "https://medlineplus.gov/commoncold.html",
    usage:
      "Supportive care only: rest, fluids, humidified air. OTC paracetamol or ibuprofen may be used " +
      "for fever and aches according to the product label; never exceed the labeled maximum daily " +
      "dose, and check combination products for duplicate paracetamol. This does not cure the cold.",
    safety:
      "Paracetamol: overdose causes liver damage; limit or avoid alcohol while using it. Aspirin: " +
      "never give to children or teenagers (Reye's syndrome risk). NSAIDs: use caution with " +
      "kidney disease, stomach ulcers, or in pregnancy (ask a clinician first).",
    seekCare:
      "Fever lasting more than 3 days or lasting beyond ~10 days, difficulty breathing or " +
      "swallowing, high fever in infants or older adults, or any illness in someone who is " +
      "immunocompromised or has serious heart/lung disease.",
  }),
  edu({
    n: 2,
    condition: "Seasonal Allergies",
    condition_name: "Seasonal Allergic Rhinitis (hay fever)",
    medicine_name: "Loratadine (second-generation oral antihistamine)",
    overview:
      "IgE-mediated inflammation of the nasal lining triggered by seasonal pollen or other " +
      "allergens (sneezing, itchy/runny nose, itchy eyes). It is a chronic, controlled " +
      "condition rather than one that is 'cured'. Sources: AAAAI " +
      "https://www.aaaai.org/conditions-treatments/allergic-rhinitis ; MedlinePlus " +
      "https://medlineplus.gov/allergicrhinitis.html",
    usage:
      "Allergen avoidance and saline nasal rinse help. Second-generation antihistamines treat " +
      "sneezing and itch; intranasal corticosteroid sprays help persistent nasal blockage. " +
      "Use per product label or a clinician's directions.",
    safety:
      "Antihistamines: sedation (greater with first-generation agents); alcohol increases " +
      "drowsiness. Nasal steroids: minor nose bleeds with use; follow label directions. " +
      "Pregnant or breastfeeding: check with a clinician first.",
    seekCare:
      "Wheezing or shortness of breath (asthma), high fever with facial pain or thick " +
      "discharge (possible sinus infection), eye pain or vision changes, or symptoms that do " +
      "not respond to over-the-counter treatment.",
  }),
  edu({
    n: 3,
    condition: "Migraine",
    condition_name: "Migraine",
    medicine_name: "Sumatriptan (triptan); OTC NSAIDs such as ibuprofen for mild attacks",
    overview:
      "Recurrent episodes of throbbing, usually one-sided headache with nausea, light and sound " +
      "sensitivity. An untreated attack typically lasts 4-72 hours. Triggers include stress, " +
      "missed sleep, and hormonal changes; keeping a symptom diary helps identify them. " +
      "Sources: MedlinePlus https://medlineplus.gov/migraine.html ; NICE migraine guideline " +
      "https://www.nice.org.uk/guidance/cg150",
    usage:
      "Treatment works best when taken early in an attack. Triptans are rescue medicines, not " +
      "prevention; frequent attacks (roughly 4+ headache days per month) are a reason to see a " +
      "clinician to discuss prevention options.",
    safety:
      "Triptans: not suitable for people with coronary, stroke, or other vascular disease, " +
      "uncontrolled high blood pressure, or certain migraine types (hemiplegic or brainstem); " +
      "follow labeled maximum per-day limits. NSAIDs: stomach, kidney, and heart risks with " +
      "prolonged use.",
    seekCare:
      "'Worst headache of your life', sudden thunderclap onset, new weakness/numbness or " +
      "vision or speech changes, fever with stiff neck, an attack lasting more than 72 hours, " +
      "or first migraine after age 50.",
  }),
  edu({
    n: 4,
    condition: "Type 2 Diabetes",
    condition_name: "Type 2 Diabetes Mellitus",
    medicine_name: "Metformin (first-line oral agent)",
    overview:
      "Chronic condition of high blood glucose from insulin resistance; diagnosis is made by a " +
      "clinician using laboratory tests. It is managed for life rather than cured; consistent " +
      "management lowers the risk of heart, kidney, eye, and nerve complications. Sources: " +
      "American Diabetes Association https://diabetes.org/understanding-diabetes/type-2-diabetes " +
      "; MedlinePlus https://medlineplus.gov/type2diabetes.html",
    usage:
      "Regular activity and a healthy dietary pattern are first-line. Metformin is commonly the " +
      "first oral medicine and is usually taken with food; blood-glucose targets are " +
      "individualized. Blood sugar and HbA1c are monitored periodically by a care team.",
    safety:
      "Metformin: early stomach upset (often settles; taking with food helps), B12 deficiency " +
      "with long-term use, and a rare but serious lactic acidosis risk with serious kidney " +
      "disease, dehydration, or contrast imaging. Any dose or stop/continue decision is a " +
      "clinician's, not self-prescribing.",
    seekCare:
      "Signs of very high blood sugar: frequent urination, excessive thirst, unexplained " +
      "weight loss, repeated infections, or confusion. Urgent care for nausea, vomiting, or " +
      "deep/rapid breathing. Hypoglycemia symptoms (shaking, sweating, confusion) when taking " +
      "certain medicines - seek care promptly.",
  }),
  edu({
    n: 5,
    condition: "Hypertension",
    condition_name: "Hypertension (high blood pressure)",
    medicine_name:
      "Amlodipine (calcium-channel blocker - one of several first-line classes; choice is a clinician's)",
    overview:
      "Sustently elevated arterial pressure, usually without symptoms, that raises the risk of " +
      "stroke, heart attack, and kidney damage. Diagnosis and treatment planning are done by a " +
      "clinician. Sources: NICE blood pressure guideline " +
      "https://www.nice.org.uk/guidance/cg136 ; NHS " +
      "https://www.nhs.uk/conditions/high-blood-pressure/",
    usage:
      "Medication (when indicated) is usually long-term; keep a home blood-pressure log and " +
      "take medicines consistently. Reducing salt, maintaining a healthy weight, regular " +
      "activity, and limiting alcohol all help. Do not stop medicines without medical advice.",
    safety:
      "Amlodipine: ankle swelling and flushing are common. ACE inhibitors/ARBs: kidney function " +
      "and potassium are checked after starting. Do not self-select or self-adjust " +
      "antihypertensives.",
    seekCare:
      "Readings of 180/120 mmHg or higher WITH symptoms (chest pain, shortness of breath, " +
      "weakness, slurred speech, vision change) are an emergency. A very high reading without " +
      "symptoms still needs same-day clinician contact.",
  }),
  edu({
    n: 6,
    condition: "Acid Reflux",
    condition_name: "Gastroesophageal Reflux Disease (GERD)",
    medicine_name: "Omeprazole (proton-pump inhibitor); antacids for breakthrough",
    overview:
      "Reflux of stomach acid into the esophagus causing heartburn and acid regurgitation. It " +
      "is managed with lifestyle changes and short-term acid suppression; symptoms usually " +
      "improve within days for antacids and over days-to-weeks for PPIs. Sources: MedlinePlus " +
      "https://medlineplus.gov/ency/article/000831.htm ; NHS " +
      "https://www.nhs.uk/conditions/heartburn-and-indigestion/",
    usage:
      "Lifestyle steps first: weight reduction, smaller meals, not lying down for 2-3 hours " +
      "after eating, elevating the head of the bed, avoiding personal trigger foods. Short " +
      "OTC PPI courses follow the product label; antacids can be used for breakthrough " +
      "symptoms. Recurring needs a clinician's plan.",
    safety:
      "Do not exceed 14 days of OTC PPI use without clinician advice; recurrent flares " +
      "(3+ months per year) need review. Long-term PPI use (clinician-directed) is " +
      "associated with lower bone density and mineral loss, so it is periodically reviewed " +
      "and kept at the lowest effective dose.",
    seekCare:
      "Alarm features: difficulty or pain on swallowing, unexplained weight loss, vomiting " +
      "blood or black stools, new-onset symptoms in people over 50, or persistent symptoms " +
      "unrelieved by OTC treatment.",
  }),
  edu({
    n: 7,
    condition: "Eczema",
    condition_name: "Eczema (atopic dermatitis)",
    medicine_name: "Hydrocortisone 1% (mild topical corticosteroid)",
    overview:
      "Chronic inflammatory skin condition with flares of itchy, red, dry patches, driven by a " +
      "skin-barrier defect and immune over-response. It is a lifelong management condition " +
      "rather than one that is cured. Sources: American Academy of Dermatology " +
      "https://www.aad.org/public/diseases/eczema ; NHS " +
      "https://www.nhs.uk/conditions/eczema/",
    usage:
      "Daily emollients (moisturizers), used generously, form the base of treatment; use lukewarm " +
      "water and gentle, fragrance-free cleansers. During flares, a short course of a mild " +
      "topical steroid per label or clinician directions. Avoid known triggers such as " +
      "fragrances, dyes, and very hot showers.",
    safety:
      "Prolonged or repeated use of topical steroids (especially on the face, in skin folds, " +
      "or in children) can thin the skin and cause stretch marks; keep courses short as " +
      "directed. Do not apply steroid creams to broken or infected skin without advice.",
    seekCare:
      "Spreading, weeping, or honey-colored crusting (possible infection), fever, painful " +
      "worsening, severe sleep or daily-life impact, or no improvement with OTC treatment.",
  }),
  edu({
    n: 8,
    condition: "Asthma",
    condition_name: "Asthma",
    medicine_name: "Salbutamol (albuterol) rescue inhaler; inhaled corticosteroid controller",
    overview:
      "Chronic airway inflammation with episodic wheeze, chest tightness, and shortness of " +
      "breath, controlled by daily inhaled corticosteroid therapy plus a reliever inhaler " +
      "for symptoms. Asthma is managed long-term, not 'cured'. Sources: GINA report " +
      "https://ginasthma.org/gina-report/gina-main-report/ ; MedlinePlus " +
      "https://medlineplus.gov/asthma.html",
    usage:
      "Use the controller inhaler every day as directed, even when feeling well; use the " +
      "reliever only for symptoms. Inhaler technique matters - demonstrate with a clinician. " +
      "A written asthma action plan and trigger avoidance (smoke, dust, strong odors) are " +
      "recommended.",
    safety:
      "Reliever inhalers can cause tremor, palpitations, and low potassium with heavy use. " +
      "Needing the reliever more than a few times a week or waking at night with symptoms " +
      "means the asthma is poorly controlled and needs a clinician review - do NOT simply " +
      "stop the controller.",
    seekCare:
      "Emergency signs: rescue inhaler not helping, difficulty speaking in full sentences, " +
      "lips/fingertips turning blue, or chest movement not keeping up with breathing. These " +
      "need immediate emergency care.",
  }),
  edu({
    n: 9,
    condition: "Iron Deficiency",
    condition_name: "Iron-Deficiency Anemia",
    medicine_name: "Ferrous sulfate (oral iron supplement)",
    overview:
      "Depleted iron stores leading to anemia, most often from blood loss, with symptoms " +
      "including fatigue, pallor, and (in children) pica. Diagnosis requires a clinician's " +
      "laboratory confirmation. Replenishing iron raises hemoglobin over weeks; finding and " +
      "treating the CAUSE of the iron loss is the core of care. Sources: MedlinePlus " +
      "https://medlineplus.gov/ency/article/002256.htm ; NIH Office of Dietary " +
      "Supplements https://ods.od.nih.gov/factsheets/Iron-Consumer/",
    usage:
      "Oral iron is taken under clinician supervision after confirmed deficiency. Taking it " +
      "with vitamin C (e.g. a glass of orange juice) improves absorption; tea, coffee, and " +
      "calcium reduce it - separate them. Typical repletion runs for weeks to a few months " +
      "until stores refill, guided by repeat blood tests.",
    safety:
      "Common side effects: constipation, stomach upset, dark stools (harmless). Iron is " +
      "toxic in large accidental ingestions - keep all supplements locked away from " +
      "children. Do not self-supplement without a lab-confirmed deficiency; excess iron is " +
      "harmful.",
    seekCare:
      "Visible or suspected blood loss (including black, tarry stools), shortness of breath, " +
      "chest pain or a fast heartbeat from anemia, or symptoms that do not improve with the " +
      "prescribed course.",
  }),
  edu({
    n: 10,
    condition: "Osteoarthritis",
    condition_name: "Osteoarthritis (knee/hip - most common joints)",
    medicine_name:
      "Diclofenac (topical NSAID gel - a safer example than oral NSAIDs for chronic use)",
    overview:
      "Progressive wear of joint cartilage causing pain and stiffness, usually in the " +
      "knees or hips with aging. There is no cure; the goal is symptom control and " +
      "maintaining function. Sources: MedlinePlus " +
      "https://medlineplus.gov/osteoarthritis.html ; NICE osteoarthritis guidance " +
      "https://www.nice.org.uk/guidance/cg172",
    usage:
      "Regular low-impact exercise, weight management where relevant, and physiotherapy are " +
      "first-line. Topical NSAID gels applied to the joint per label have lower systemic " +
      "effects than oral NSAIDs; paracetamol is another option. Pain control usually " +
      "improves gradually with consistent use of these measures.",
    safety:
      "Oral NSAIDs: stomach bleeding, kidney, and heart risks with chronic use - prefer the " +
      "lowest effective course and review with a clinician. Topical NSAIDs are generally " +
      "better tolerated but should not be used on broken skin. Do not combine multiple " +
      "NSAID products.",
    seekCare:
      "A joint that becomes red, warm, and feverish (possible infection or crystal " +
      "arthritis - urgent), new trauma or significant functional decline, or weight loss " +
      "and night pain out of proportion to typical osteoarthritis.",
  }),
];

// Private medication schedules — reference the 2 demo users (round-robin). The
// medicine names and reminder times are clearly fictional TEST DATA: no real
// medicine names, no real doses, no real medication schedules.
const schedules = Array.from({ length: 10 }, (_, i) => ({
  user_index: i % users.length, // round-robin between demo.user1 and demo.user2
  medicine_name: `Demo Schedule Medicine ${i + 1} (TEST DATA - not a real medicine)`,
  dosage_instructions:
    "TEST DATA ONLY - placeholder reminder set. This is not a real dose, medication " +
    "schedule, or treatment plan. Never use it for real medication decisions.",
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
  // NOTE: the admins table is intentionally left alone — never read, deleted,
  // or inserted by this seeder.
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

    // 1) Users
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

    // 2) Doctors
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

    // 3) Medication instructions — each references doctor #i (existing FK).
    console.log("\nmedication_instructions:");
    for (let i = 0; i < instructions.length; i++) {
      const r = await ensureInstruction(client, write, doctorRowIds[i], instructions[i]);
      console.log(
        `  "${instructions[i].title}" [${instructions[i].publication_status}]${label(r)}` +
          ` -> doctor ${doctorRowIds[i] ?? "-"}`,
      );
      mark(r);
    }

    // 4) Private medication schedules — each references a demo user (round-robin
    //    via user_index), with 1+ reminder times in the TIME[] column. Names are
    //    clearly fictional TEST DATA; no real medicines or doses are used.
    console.log("\nmedication_schedules:");
    for (let i = 0; i < schedules.length; i++) {
      const ownerIndex = schedules[i].user_index;
      const r = await ensureSchedule(client, write, userRowIds[ownerIndex], schedules[i]);
      console.log(
        `  "${schedules[i].medicine_name}" (${schedules[i].reminder_times.length} reminders)${label(r)}` +
          ` -> user ${userRowIds[ownerIndex] ?? "-"}`,
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
      console.log(
        `Seeded: ${users.length} users, ${doctors.length} doctors (all approved), ` +
          `${instructions.length} published educational instructions, ` +
          `${schedules.length} test-data schedules. (admins table untouched.)`,
      );
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
