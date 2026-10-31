 <p align="center">
  <img src="docs/images/meditrack-logo.png" alt="MediTrack Logo" width="160">
</p>

<h1 align="center">MediTrack</h1>

<p align="center">
  <strong>Medication Instructions and Reminder Management</strong>
</p>

<p align="center">
  <a href="https://medi-track-lake-two.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Frontend-Vercel-black?logo=vercel" alt="Live Frontend">
  </a>
  <a href="https://meditrack-j58b.onrender.com">
    <img src="https://img.shields.io/badge/Backend_API-Render-46E3B7?logo=render&logoColor=white" alt="Backend API">
  </a>
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version 1.0.0">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<p align="center">
  <a href="https://github.com/Shresth-shukla-beginercoder/MediTrack">GitHub Repository</a> ·
  <a href="https://medi-track-lake-two.vercel.app/">Live Application</a> ·
  <a href="https://meditrack-j58b.onrender.com/api/health">Backend Health</a>
</p>

---

## Project Status

MediTrack is an ongoing full-stack development project. Backend development and manual API testing are underway, and the tested authentication, administration, instruction-access, and schedule-management flows have been implemented. The React frontend is still under development.

## Screenshots

### Home Page

![MediTrack Home Page](docs/images/home-page.png)

### Doctor Registration

![MediTrack Doctor Registration](docs/images/doctor-registration.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database Design](#database-design)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Medical Disclaimer](#medical-disclaimer)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Overview

MediTrack is a full-stack web application designed to organize doctor-provided medication information and help users manage their personal medication schedules.

The application follows a role-based design with three main roles:

- **Users** can access published medication instructions and manage their own personal schedules.
- **Doctors** can manage their own instructions after verification and approval.
- **Administrators** can review doctor registrations and manage verification decisions.

MediTrack does not replace a medical consultation or independently prescribe medication. Users should follow instructions provided by their qualified healthcare professional.

## Features

### Authentication and Authorization

- User and doctor authentication.
- JSON Web Token (JWT)-based authentication.
- Role-based access control.
- Protected API routes.
- Separate administrative access.
- Password handling designed around secure hashing.

### Doctor Management

- Doctor profile management.
- Doctor registration and professional information.
- Doctor verification workflow.
- Pending, approved, and rejected verification states.
- Administrative review of doctor credentials.
- Restrictions on publishing instructions until approval.

### Medication Instructions

- Doctors manage their own medication instructions.
- Instructions are associated with the doctor who created them.
- Public instruction access is restricted to published instructions from approved doctors.
- Draft and unpublished instructions are not exposed through public instruction endpoints.
- Doctor ownership is checked before protected modifications.

### Personal Medication Schedules

- Create, view, update, and delete medication schedules.
- Associate schedules with their respective user accounts.
- Keep schedule records private to their owners.
- Support schedule information such as medication name, duration, dates, frequency, and reminder times, according to the implemented API validation rules.

### Administration

- Protected administrator endpoints.
- Doctor listing and detail retrieval.
- Doctor verification review.
- Ability to request additional information or reject a verification request.
- Input validation for administrative actions.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| Backend | Node.js |
| Backend framework | Express.js |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcrypt-based password hashing |
| API testing | Postman |
| Database tooling | pgAdmin |
| Version control | Git and GitHub |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Database hosting | Neon PostgreSQL |

## Project Structure

```text
meditrack/
├── README.md
├── database/
│   └── schema.sql
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── services/
└── docs/
    └── images/
        ├── meditrack-logo.png
        ├── home-page.png
        └── doctor-registration.png
```

### Directory Description

| Path | Purpose |
|---|---|
| `database/schema.sql` | SQL definitions for the PostgreSQL database schema. |
| `backend/src/app.js` | Express application configuration and middleware. |
| `backend/src/server.js` | Backend server startup. |
| `backend/src/config/` | Application and database configuration. |
| `backend/src/controllers/` | Request-handling logic. |
| `backend/src/middleware/` | Authentication, authorization, and request-processing middleware. |
| `backend/src/models/` | Database access and data operations. |
| `backend/src/routes/` | API route definitions. |
| `backend/src/scripts/` | Utility and development scripts. |
| `backend/src/utils/` | Shared helper functions. |
| `frontend/src/components/` | Reusable React components. |
| `frontend/src/context/` | Shared application state. |
| `frontend/src/hooks/` | Custom React hooks. |
| `frontend/src/pages/` | Application pages. |
| `frontend/src/services/` | Frontend API communication. |
| `docs/images/` | Project logo and README screenshots. |

## Application Architecture

MediTrack uses a frontend-backend-database architecture.

```text
             React Frontend
                   |
                   | HTTP Requests / JSON
                   v
             Express.js REST API
                   |
          +--------+---------+
          |                  |
 Authentication       Authorization
          |                  |
          +--------+---------+
                   |
             Controllers
                   |
                Models
                   |
                   v
             PostgreSQL
               Database
```

The frontend communicates with the backend through HTTP requests. The backend validates requests, authenticates users, enforces role and ownership restrictions, and interacts with PostgreSQL.

## Prerequisites

Install the following software before running the application:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [PostgreSQL](https://www.postgresql.org/) or a configured PostgreSQL container
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) for API testing
- A code editor such as Visual Studio Code

You may use pgAdmin to inspect and manage the PostgreSQL database.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shresth-shukla-beginercoder/MediTrack.git
cd MediTrack
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure PostgreSQL

Make sure your PostgreSQL server is running.

Create a database for MediTrack using pgAdmin or the PostgreSQL command-line tools. For example:

```sql
CREATE DATABASE meditrack;
```

Execute the schema file against the database you created:

```bash
psql -U <YOUR_POSTGRES_USER> -d meditrack -f ../database/schema.sql
```

Replace the username with your PostgreSQL username. If you use pgAdmin, you can open `database/schema.sql` in the Query Tool and execute it against the `meditrack` database.

Run the schema only according to its contents and your existing database state. If tables already exist, review the SQL before executing it again.

### 4. Configure Backend Environment Variables

Create a `.env` file inside the `backend/` directory.

```env
PORT=5001
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@localhost:<DB_PORT>/meditrack
JWT_SECRET=<GENERATE_A_LONG_RANDOM_SECRET>
NODE_ENV=development
```

These are example variable names. Check the backend configuration files and use the exact environment variable names expected by your implementation. If the application uses individual PostgreSQL connection variables instead of `DATABASE_URL`, configure those instead.

Do not commit the real `.env` file or publish database passwords, JWT secrets, or access tokens.

### 5. Start the Backend

From the `backend/` directory, run:

```bash
npm run
```

Check the scripts displayed by npm. If your `package.json` defines a `dev` script, use:

```bash
npm run dev
```

If it defines a `start` script, use:

```bash
npm start
```

The backend listens on the port configured in your environment variables.

### 6. Install Frontend Dependencies

Open a second terminal from the project root:

```bash
cd frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL in your browser.

> The frontend is still under development. Starting the Vite server does not mean that all user, doctor, and administrator screens or workflows are complete.

## Environment Variables

Keep environment variables private and outside version control.

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend server. |
| `DATABASE_URL` | PostgreSQL connection string, if supported by the implementation. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. |
| `NODE_ENV` | Application environment, such as `development` or `production`. |

The table documents common example variables, not a guarantee that every variable is used under that exact name. Confirm the actual requirements in `backend/src/config/`, `backend/src/server.js`, and the authentication code.

For deployment, use the hosting provider's environment-variable settings rather than uploading local secrets.

## Running the Application

For local development, run the backend and frontend in separate terminals.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

Use the script defined in `backend/package.json`; if there is no `dev` script, use the available start command.

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

**Database**

Confirm that PostgreSQL is running, the `meditrack` database exists, and the configured credentials match your backend environment.

### Live Deployment

| Service | URL |
|---|---|
| Frontend | [MediTrack on Vercel](https://medi-track-lake-two.vercel.app/) |
| Backend | [MediTrack API on Render](https://meditrack-j58b.onrender.com) |
| Backend Health Check | [API Health Endpoint](https://meditrack-j58b.onrender.com/api/health) |

## API Reference

The backend uses versioned REST API routes under `/api/v1`.

| Route prefix | Purpose |
|---|---|
| `/api/v1/auth` | Authentication-related endpoints. |
| `/api/v1/users` | User-related operations. |
| `/api/v1/doctor/instructions` | Doctor instruction management. |
| `/api/v1/doctor` | Doctor profile and verification-related operations. |
| `/api/v1/instructions` | Access to published medication instructions. |
| `/api/v1/schedules` | Personal medication schedule management. |
| `/api/v1/admin` | Protected administrative operations. |

The exact HTTP methods, request bodies, validation rules, and response formats are defined in the backend route and controller files.

### Common REST Operations

| Method | Typical purpose |
|---|---|
| `GET` | Retrieve resources. |
| `POST` | Create a resource or submit an action. |
| `PATCH` | Update selected fields of a resource. |
| `DELETE` | Delete a resource. |

These are general HTTP conventions. Refer to the actual route definitions for the supported operations on each endpoint.

### Authentication

Protected endpoints may require a JWT in the request header:

```http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

Obtain a valid token through the application's authentication endpoint. Never publish real access tokens in documentation, screenshots, issue reports, or public repositories.

## Authentication and Authorization

MediTrack separates authentication from authorization:

- **Authentication** verifies the identity of the account making a request.
- **Authorization** determines whether that account has permission to perform the requested action.

The backend uses role-based restrictions for protected user, doctor, and administrator operations. Resource ownership is also important: a user should only be able to manage their own medication schedules, and a doctor should only be able to modify their own instructions.

Administrative verification controls whether a doctor can publish instructions. Public instruction access is restricted to content that meets the application's publication and doctor-approval rules.

## Database Design

PostgreSQL stores the application's structured data. The database schema is maintained in:

```text
database/schema.sql
```

The application data model supports the following main concepts:

- **Users:** account and authentication information.
- **Doctors:** professional profile and verification information.
- **Medication instructions:** doctor-created instruction records associated with their owners.
- **Medication schedules:** personal schedules associated with individual users.
- **Admins:** administrator account and authentication information.

The exact table names, column names, constraints, and relationships should be checked in `database/schema.sql`.

Schedule ownership must be enforced by the backend, not only by hiding controls in the frontend. The backend should validate permissions on every read, update, and delete request.

## Testing

The backend has been manually tested using Postman.

Testing performed so far includes:

- Administrator authentication and protected administrative endpoints.
- Doctor profile and verification-related endpoints.
- Blocking unapproved doctors from publishing instructions.
- Restricting public access to unpublished instructions.
- Creating, listing, retrieving, updating, and deleting medication schedules.
- Checking that one user's token cannot access another user's schedule.
- Validating selected administrative inputs and rejected requests.

These are manual test results for the scenarios exercised so far; they do not establish complete automated test coverage or prove that every possible edge case has been tested.

### Recommended Additional Tests

- Invalid or expired JWTs.
- Missing and malformed request fields.
- Duplicate account registration.
- Database connection failures.
- SQL injection resistance.
- Password reset and account recovery, if implemented.
- Concurrent schedule updates.
- Doctor ownership checks across all instruction operations.
- End-to-end testing after the frontend is implemented.

## Security Considerations

- Keep `.env` files and credentials out of Git.
- Use strong, randomly generated JWT secrets.
- Hash passwords with an appropriate password-hashing algorithm.
- Validate and sanitize incoming data.
- Use parameterized SQL queries.
- Apply authorization checks in the backend.
- Do not expose unpublished instructions through public endpoints.
- Restrict doctor publishing permissions to approved accounts.
- Protect personal schedules from cross-user access.
- Use HTTPS and secure deployment configuration in production.
- Avoid using real patient or medical information in development and testing.

## Medical Disclaimer

MediTrack is a software development project for organizing doctor-provided medication instructions and personal schedules. It is not a substitute for professional medical advice, diagnosis, or treatment.

The application does not independently prescribe medicines. Users should consult a qualified healthcare professional before starting, stopping, or changing medication or its dosage.

## Future Improvements

Planned or potential improvements include:

- Complete the React frontend for users, doctors, and administrators.
- Integrate the frontend with the existing REST API.
- Build dashboards for each role.
- Improve schedule creation and reminder management.
- Add appropriate reminder delivery mechanisms.
- Improve doctor verification workflows.
- Add automated backend and frontend tests.
- Add API documentation with request and response examples.
- Improve accessibility, responsive design, logging, and error handling.

These are future improvements and should not be considered completed features unless implemented and tested.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Test the changes locally.
5. Submit a pull request describing the changes.

Do not include secrets, real patient information, or personal credentials in commits, test fixtures, or issue reports.

## Author

**Shresth Shukla**

B.Tech Computer Science and Engineering — Artificial Intelligence and Machine Learning

- **GitHub:** [Shresth-shukla-beginercoder](https://github.com/Shresth-shukla-beginercoder)
- **Project Repository:** [MediTrack](https://github.com/Shresth-shukla-beginercoder/MediTrack)

## License

No license has been specified yet. Unless a license is added to the repository, do not assume that others have permission to redistribute or reuse the project.

If you intend to publish the project as open source, choose an appropriate license and add its full text in a root-level `LICENSE` file.