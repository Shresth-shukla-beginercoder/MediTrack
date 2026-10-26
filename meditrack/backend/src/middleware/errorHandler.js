/**
 * Centralized Error Handling Middleware
 *
 * Intercepts all errors thrown in routes and controllers.
 * Ensures that internal server details, database specifics,
 * or raw stack traces are never leaked in API responses.
 */

export const errorHandler1 = (err, req, res, next) => {
  console.error("BACKEND ERROR:", err.stack || err);

  // Keep your existing error-handling code below.
};

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  
  }
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // PostgreSQL unique constraint violation error (code '23505')
  if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with this information already exists.';
  }

  // PostgreSQL foreign key violation error (code '23503')
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Invalid reference to a related record.';
  }

  // PostgreSQL invalid input syntax (e.g. invalid UUID/int or date format)
  if (err.code === '22P02') {
    statusCode = 400;
    message = 'Invalid input format.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  res.status(statusCode).json({
  success: false,
  message: message
});

};
