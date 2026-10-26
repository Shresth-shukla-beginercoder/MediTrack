import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

// Choose the backend port
const PORT = process.env.PORT || 5000;

// Start the backend server
const server = app.listen(PORT, () => {
  console.log(`MediTrack server is running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Handle server startup errors
server.on("error", (error) => {
  console.error("Server failed to start:", error.message);
  process.exitCode = 1;
});

// Close the server and database safely
async function shutdown() {
  console.log("\nShutting down MediTrack...");

  server.close(async () => {
    console.log("Server closed.");

    try {
      await pool.end();
      console.log("Database connection closed.");
      process.exitCode = 0;
    } catch (error) {
      console.error("Database shutdown error:", error.message);
      process.exitCode = 1;
    }
  });
}

// Run shutdown when you stop the server
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);







// import app from './app.js';
// import { pool } from './config/db.js';

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`===============================================`);
//   console.log(` MediTrack Backend Server running on port ${PORT}`);
//   console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(` Health check: http://localhost:${PORT}/api/health`);
//   console.log(`===============================================`);
// });

// // Graceful shutdown
// const gracefulShutdown = (signal) => {
//   console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
//   server.close(async () => {
//     console.log('HTTP server closed.');
//     try {
//       await pool.end();
//       console.log('PostgreSQL connection pool closed.');
//       process.exit(0);
//     } catch (err) {
//       console.error('Error closing database pool:', err.message);
//       process.exit(1);
//     }
//   });
// };

// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
