# MediTrack — Isolated Development Data Seeder

This `seed/` folder is a self-contained utility for loading **fictional, clearly-marked
test data** into the MediTrack PostgreSQL database for local development and manual
testing. It seeds **10 records** for each of the following existing tables:

| Table | Purpose |
|-------|---------|
| `admins` | Administrative accounts |
| `users` | Patient/user accounts |
| `doctors` | Doctor accounts across all verification states |
| `medication_instructions` | Educational content, one per doctor |
| `medication_schedules` | Private schedules, one per user (with a `TIME[]` reminder list) |

All foreign-key relationships are preserved: every instruction references an existing
doctors row, and every schedule references an existing users row and stores one or more
reminder times in the existing `reminder_times TIME[]` column.

## Strict scope (read first)

Everything in this task is confined to this folder:

- **Files created/modified:** only `seed/seed.js` and `seed/README.md`.
- **No other file was touched.** The backend `package.json`, lockfiles, `.env`,
  `src/config/db.js`, models, routes, controllers, middleware, and the frontend were
  **not** modified. No database migrations or table changes were made. No packages were
  installed.
- On each run the seeder **deletes only its own previously-seeded demo rows**
  (matched by demo markers: `demo.*@example.com` and `Demo ...` names) and
  **re-inserts the same dataset**. It never `DROP`s or `TRUNCATE`s a table and
  never touches any row that does not match a demo marker.

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

4. **Reset-and-refill (re-runnable, no duplicates).** The draft inserted unconditionally,
   so re-running it created duplicates. Now each run first **deletes the previously-seeded
   demo rows** and then re-inserts the same clean dataset, so the data is identical every
   time you run it:
   - Deletion is scoped to demo markers only — `email LIKE 'demo.admin%@example.com'`,
     `'demo.user%@example.com'`, `'demo.doctor%@example.com'`, instruction
     `title LIKE 'Demo Educational Instruction%'`, and schedule
     `medicine_name LIKE 'Demo Schedule Medicine%'`.
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

7. **No verification bypass.** An instruction is stored as `published`/`withdrawn` only
   when its owning doctor's `verification_status` is `approved`; otherwise it is stored
   as `draft`. Public listing logic (which requires an `approved` doctor) is therefore
   never bypassed. Doctor rows are seeded across the full status set
   (`approved`/`pending`/`rejected`/`suspended`) so admin-review flows can be tested;
   the nullable `doctors.reviewed_by_admin_id` is left `NULL`, so no admin approval is
   implied.

## Requirements that could NOT be satisfied without leaving `seed/`

**None.** Every requirement was satisfiable inside `seed/`:

- The five tables already exist with the required columns, including
  `medication_schedules.reminder_times TIME[]`; no migration or DDL was needed.
- `bcrypt` was already a dependency; no install was required.
- No npm script was added (the `package.json` is untouched); the seeder runs via plain
  `node seed/seed.js`.
- No `.env`, `db.js`, model, or service file had to change — the seeder only *reads*
  the existing `DB_*` / `NODE_ENV` values.

## Prerequisites

1. The MediTrack database is up and its schema is applied (the project's Docker
   PostgreSQL container, or an equivalent local instance).
2. From `backend/.env`, the target database is reachable and is a **development/test**
   database (local host, `NODE_ENV=development` or `test`).

## How to run

From the **backend** directory (`.../meditrack/backend`):

```bash
# Reset the demo dataset and re-seed it (gated by the dev/test guard). Re-run safe.
node seed/seed.js

# Read-only preview — shows how many demo rows would be deleted and re-created.
node seed/seed.js --dry-run
```

There is deliberately **no** npm script (the task requires `package.json` to remain
unchanged). After a successful run, all demo accounts share this **test-only**
password: `DemoPass123!` (printed at the end of the run).

### Safety reminders

- The seeder will not touch a database it cannot identify as a local dev/test target.
- On each run it deletes **only** the previously-seeded demo rows (matched by demo
  marker) and re-inserts them. It never touches unrelated rows and never drops or
  truncates a table.
- All seeded content is fictional and marked as test data; it is **not** medical
  advice and must not be used for real medication decisions.

## Verifying the results (read-only SQL)

Run these in your Postgres client (e.g. `psql` against `meditrack_db`). They are all
`SELECT` statements and change nothing.

### 1. Count the seeded rows per table

```sql
SELECT 'admins'::text AS table_name, COUNT(*) AS seeded_rows
FROM admins WHERE email LIKE 'demo.admin%@example.com'
UNION ALL
SELECT 'users', COUNT(*) FROM users WHERE email LIKE 'demo.user%@example.com'
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors WHERE email LIKE 'demo.doctor%@example.com'
UNION ALL
SELECT 'medication_instructions', COUNT(*)
FROM medication_instructions WHERE title LIKE 'Demo Educational Instruction%'
UNION ALL
SELECT 'medication_schedules', COUNT(*)
FROM medication_schedules WHERE medicine_name LIKE 'Demo Schedule Medicine%';
```

Expect `10` for each table after any run. Re-running resets the demo rows and re-creates
the same 10, so the count stays `10` — no duplicates.

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
LEFT JOIN users u ON u.user_id = s.user_id
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
JOIN users u ON u.user_id = s.user_id
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

### 6. Confirm the reset on re-run

Run `node seed/seed.js` again. The demo rows are deleted and re-created, so their ids
will differ from the previous run, but the step-1 counts stay at `10` each and the
content is identical. The seeder reports `Reset 50 old demo row(s) and re-created 50
new record(s)`. Any non-demo (real) rows are untouched.

## Files in this folder

```text
backend/
└── seed/
    ├── seed.js     # the seeder (reset + re-seed, transactional, guarded)
    └── README.md   # this document
```
