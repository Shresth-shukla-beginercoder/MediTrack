-- ==============================================================================
-- MediTrack - Database Schema Reference & Recovery Document
-- ==============================================================================
-- NOTE: This file is for documentation and recovery purposes only.
-- DO NOT automatically execute this against the live PostgreSQL database!
-- Your Docker PostgreSQL container already has these tables created.
-- ==============================================================================

-- 1. ADMINS TABLE
-- Stores administrative user accounts. No public registration endpoint exists.
CREATE TABLE IF NOT EXISTS admins (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
-- Stores ordinary patients/users who manage personal medication schedules.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DOCTORS TABLE
-- Stores medical professionals awaiting verification or verified to publish medical info.
-- verification_status: 'pending', 'approved', 'rejected', 'suspended'
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    graduation_year INT NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    professional_registration_number VARCHAR(100) NOT NULL,
    registration_authority VARCHAR(255) NOT NULL,
    registration_document_url VARCHAR(500),
    workplace VARCHAR(255) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    public_phone VARCHAR(50),
    social_media_url VARCHAR(500),
    verification_status VARCHAR(50) DEFAULT 'pending',
    admin_message TEXT,
    reviewed_by_admin_id INT REFERENCES admins(admin_id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MEDICATION INSTRUCTIONS TABLE
-- Educational, non-prescriptive medical information authored by approved doctors.
-- publication_status: 'draft', 'published', 'withdrawn'
CREATE TABLE IF NOT EXISTS medication_instructions (
    instruction_id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    medical_overview TEXT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    general_usage_information TEXT NOT NULL,
    safety_warnings TEXT NOT NULL,
    when_to_seek_care TEXT NOT NULL,
    publication_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MEDICATION SCHEDULES TABLE
-- Private medication schedules created and owned by individual users.
-- reminder_times is an array of TIME (e.g. ARRAY['08:00:00'::TIME, '20:00:00'::TIME])
CREATE TABLE IF NOT EXISTS medication_schedules (
    schedule_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage_instructions TEXT NOT NULL,
    reminder_times TIME[] NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
