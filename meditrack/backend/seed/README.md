# MediTrack — Isolated Development Data Seeder

This `seed/` folder is a self-contained utility for loading **fictional, clearly-marked
test data** into the MediTrack PostgreSQL database for local development and manual
testing. It seeds the following existing tables:

| Table | Rows seeded | Notes |
|-------|-------------|-------|
| `users` | 2 | `demo.user1` and `demo.user2` only |
| `doctors` | 10 | **All `approved`** so the educational instructions can be published without bypassing the app's authorization rules |
| `medication_instructions` | 10 | **All `published`** educational content, one per doctor |
| `medication_schedules` | 10 | Private schedules spread across the 2 demo users (round-robin) |

The **`admins` table is intentionally not touched at all** — the seeder never reads,
inserts, or deletes admin rows.

All foreign-key relationships are preserved: every instruction references an existing
doctors row, and every schedule references one of the two existing users and stores one
or more reminder times in the existing `reminder_times TIME[]` column.

## What the educational instructions contain

The 10 `medication_instructions` rows cover common conditions
(cold, seasonal allergies, migraine, type 2 diabetes, hypertension, acid reflux, eczema,
asthma, iron-deficiency anemia, osteoarthritis). Each record:

- uses **real generic medicine names** (e.g. paracetamol/acetaminophen, loratadine,
  sumatriptan, metformin, amlodipine, omeprazole, hydrocortisone 1%, salbutamol,
  ferrous sulfate, topical diclofenac);
- provides **simple, medically accurate, educational** overviews, general care advice,
  medicine safety warnings, when-to-see-a-doctor guidance, and realistic (non-guaranteed)
  recovery information where the evidence supports it;
- links **trustworthy medical sources** in `medical_overview` (CDC, MedlinePlus, NICE,
  GINA, NIH ODS, NHS, AAAAI, ADA, AAD);
- **does not** invent doses, medication schedules, or guaranteed recovery times;
- is explicitly labelled, in multiple fields, as a **fictional demo record — educational
  content, not a real prescription or advice from a genuine doctor**.

All doctors are labelled fictional demo accounts (degree, college, workplace, and
registration fields all say `FICTIONAL TEST DATA` / `FICTIONAL TEST AUTHORITY`).

The 10 `medication_schedules` rows remain **purely fictional test data**: their medicine
names are `Demo Schedule Medicine N (TEST DATA - not a real medicine)` and their
dosage-instruction text says they are placeholder reminders, not real medication
instructions. No real medicine names or doses appear in schedules.

## Strict scope (read first)

Everything in this task is confined to this folder:

- **Files created/modified:** only `seed/seed.js` and `seed/README.md`.
- **No other file was touched.** The backend `package.json`, lockfiles, `.env`,
  `src/config/db.js`, models, routes, controllers, middleware, and the frontend were
  **not** modified. No database migrations or table changes were made. No packages were
  installed.
- On each run the seeder **deletes only its own previously-seeded demo rows**
  (matched by demo markers: `demo.*@example.com` emails and `Demo ...` titles /
  medicine names) and **re-inserts the same dataset**. It never `DROP`s or `TRUNCATE`s
  a table and never touches any row that does not match a demo marker.
- Because the current seed only creates 2 users, a re-run will also clean up any
  `demo.user3@example.com`…`demo.user10@example.com` rows left by older seed
  versions — those are still demo-marker rows, so removing them is within scope.

If a future change would need to touch a file outside `seed/`, stop and get explicit
permission first.

## Compatibility changes made to the provided script

The provided JavaScript draft was used as the starting point. These adaptations were
necessary to make it correct and safe against *this* backend:

1. **Password hashing library — `bcryptjs` → `bcrypt`.**
   The backend depends on native [`bcrypt`](../package.json) (`^5.1.1`); `bcryptjs` is
   **not** a dependency and is not present in `node_modules`, so the draft's
   `import ... from "bcryptjs"` would fail. The seeder now uses the same library the
   app uses. (Both expose `hash`/`compare`, so behavior is unchanged.)

2. **Connection — `DATABASE_URL` → the `DB_*` env vars.**
   The draft read `process.env.DATABASE_URL`, which is **not** defined by this project.
   `src/config/db.js` builds its `pg` Pool from `DB_HOST`, `DB_PORT`, `DB_NAME`,
   `DB_USER`, `DB_PASSWORD`. The seeder now mirrors that exact configuration so it
   connects to the same database the app uses — without modifying `db.js` or `.env`.

3. **Explicit `.env` load path.** The seeder loads `../.env` relative to the script, so
   `node seed/seed.js` works from the `backend/` directory (or any CWD).

4. **Reset-and-refill (re-runnable, no duplicates).** Each run first **deletes the
   previously-seeded demo rows** and then re-inserts the same clean dataset:
   - Deletion is scoped to demo markers only — `email LIKE 'demo.user%@example.com'`,
     `email LIKE 'demo.doctor%@example.com'`, instruction
     `title LIKE 'Demo Educational Instruction%'`, and schedule
     `medicine_name LIKE 'Demo Schedule Medicine%'`. The admins table is never
     queried or modified.
   - Children (`medication_instructions`, `medication_schedules`) are deleted **before**
     their owners (`doctors`, `users`) so foreign keys stay valid.
   - All deletes and re-inserts run in one transaction and roll back together on any
     failure, so a failed run changes nothing.
   - Unrelated rows never match the markers, so they are never deleted or overwritten.

5. **Dev/test target guard.** Before connecting, the seeder **refuses to run** unless
   the target is positively a local development/test database: `DB_HOST` is a local
   host (`localhost`/`127.0.0.1`/`::1`/`0.0.0.0`) **and** `NODE_ENV` is
   `development` or `test`. This prevents accidentally pointing at production.

6. **`--dry-run` mode.** `node seed/seed.js --dry-run` connects read-only, reports how
   many demo rows *would* be deleted and how many would be re-created, and makes **no**
   changes.

7. **No verification bypass.** An instruction is stored as `published` only when its
   owning doctor's `verification_status` is `approved`; otherwise it would be stored as
   `draft`. Because every demo doctor is seeded as `approved`, all 10 educational
   instructions are published — and that is permitted by the app's own rules (public
   content requires an approved doctor), not a bypass of them. The nullable
   `doctors.reviewed_by_admin_id` is left `NULL`, so no admin approval is implied.
   All published instructions are labelled educational demo content, not real
   prescriptions.

## Prerequisites

1. The MediTrack database is up and its schema is applied (the project's Docker
   PostgreSQL container, or an equivalent local instance).
2. From `backend/.env`, the target database is reachable and is a **development/test**
   database (local host, `NODE_ENV=development` or `test`).

## How to run

From the **backend** directory (`.../meditrack/backend`):

```bash
# Read-only preview first — shows what would be deleted and re-created.
NODE_ENV=development node seed/seed.js --dry-run

# Then reset the demo dataset and re-seed it (gated by the dev/test guard). Re-run safe.
NODE_ENV=development node seed/seed.js
```

(On Windows PowerShell use `$env:NODE_ENV="development"; node seed/seed.js`.)

There is deliberately **no** npm script (the `package.json` is untouched); the seeder
runs via plain `node seed/seed.js`. After a successful run, all demo accounts share
this **test-only** password: `DemoPass123!` (printed at the end of the run).

### Safety reminders

- The seeder will not touch a database it cannot identify as a local dev/test target.
- On each run it deletes **only** the previously-seeded demo rows (matched by demo
  markers) and re-inserts them. It never touches unrelated rows and never drops or
  truncates a table.
- All seeded content is fictional. The educational instructions are **not medical
  advice** and must not be used for real medication decisions. The medication
  schedules are placeholder test data only — they contain no real medicines or doses.

## Verifying the results (read-only SQL)

Run these in your Postgres client (e.g. `psql` against `meditrack_db`). They are all
`SELECT` statements and change nothing.

### 1. Count the seeded rows per table

```sql
SELECT 'users'::text AS table_name, COUNT(*) AS seeded_rows
FROM users WHERE email LIKE 'demo.user%@example.com'
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors WHERE email LIKE 'demo.doctor%@example.com'
UNION ALL
SELECT 'medication_instructions', COUNT(*)
FROM medication_instructions WHERE title LIKE 'Demo Educational Instruction%'
UNION ALL
SELECT 'medication_schedules', COUNT(*)
FROM medication_schedules WHERE medicine_name LIKE 'Demo Schedule Medicine%';
```

After a fresh run expect: **users 2, doctors 10, instructions 10, schedules 10**
(32 demo rows total). The `admins` table is not managed by this seeder and is not
counted here. Re-running resets the demo rows and re-creates the same dataset, so
the counts stay stable — no duplicates.

### 2. Foreign-key integrity — orphaned rows should be 0

```sql
-- Instructions that do NOT reference an existing doctor (expect 0):
SELECT COUNT(*) AS orphan_instructions
FROM medication_instructions mi
LEFT JOIN doctors d ON d.doctor_id = mi.doctor_id
WHERE d.doctor_id IS NULL;

-- Schedules that do NOT reference an existing user (expect 0):
SELECT COUNT(*) AS orphan_schedules
FROM medication_schedules s
LEFT JOIN users u ON s.user_id = u.user_id
WHERE u.user_id IS NULL;
```

### 3. Inspect the relationships

```sql
-- Each seeded instruction and its owning doctor + verification status:
SELECT
  mi.instruction_id,
  mi.title,
  mi.publication_status,
  d.doctor_id,
  d.full_name,
  d.verification_status
FROM medication_instructions mi
JOIN doctors d ON d.doctor_id = mi.doctor_id
WHERE d.email LIKE 'demo.doctor%@example.com'
ORDER BY mi.instruction_id;

-- Each seeded schedule and its owning user, with the reminder times:
SELECT
  s.schedule_id,
  s.medicine_name,
  s.reminder_times,
  cardinality(s.reminder_times) AS n_reminders,
  s.start_date,
  s.end_date,
  u.user_id,
  u.full_name
FROM medication_schedules s
JOIN users u ON s.user_id = u.user_id
WHERE u.email LIKE 'demo.user%@example.com'
ORDER BY s.schedule_id;
```

### 4. Confirm each schedule has 1+ reminder time in the `TIME[]` column

```sql
SELECT schedule_id, medicine_name, reminder_times
FROM medication_schedules
WHERE medicine_name LIKE 'Demo Schedule Medicine%'
  AND cardinality(reminder_times) < 1;   -- expect ZERO rows
```

### 5. Mirror the app's public-instruction rule (sanity check)

The app only shows `published` instructions that belong to `approved` doctors:

```sql
SELECT mi.title, d.full_name AS doctor_name
FROM medication_instructions mi
JOIN doctors d ON d.doctor_id = mi.doctor_id
WHERE mi.publication_status = 'published'
  AND d.verification_status = 'approved'
ORDER BY mi.instruction_id;
```

All 10 demo educational instructions should appear here.

### 6. Confirm the reset on re-run

Run `node seed/seed.js` again. The demo rows are deleted and re-created, so their ids
will differ from the previous run, but the step-1 counts stay at the same totals and
the content is identical. The seeder reports how many old demo rows it reset. Any
non-demo (real) rows are untouched.

## Files in this folder

```text
backend/
└── seed/
    ├── seed.js     # the seeder (reset + re-seed, transactional, guarded)
    └── README.md   # this document
```
