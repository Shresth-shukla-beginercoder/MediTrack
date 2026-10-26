# MediTrack - Medical Information & Medication Schedule Platform

MediTrack is a secure full-stack web application designed to help patients manage personal medication schedules while offering verified, educational medical information authored by approved doctors.

## Roles & Permissions
1. **Ordinary User**: Register, log in, view approved medical information, and securely manage private medication schedules.
2. **Doctor**: Register professional credentials (degree, medical registration ID, college, workplace), track verification status, and publish general medical overview guides once approved.
3. **Administrator**: Secure dashboard to review doctor registrations, verify credentials with authorities, and approve, reject, or suspend doctor accounts.

## Tech Stack
- **Frontend**: React (Vite), JavaScript, React Router DOM, Axios, CSS
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: PostgreSQL (Running in Docker), node-postgres (`pg`)
- **Security**: bcrypt (password hashing), jsonwebtoken (JWT auth), helmet, express-rate-limit, cors

## Local Architecture
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- PostgreSQL Database: `localhost:5435` (mapped to container port 5432)
