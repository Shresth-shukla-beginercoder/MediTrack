import { ApiError } from './errorHandler.js';

// RFC 5322 compliant simplified email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates that an email is present and properly formatted.
 */
export const isValidEmail = (email) => {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
};

/**
 * Validates password strength:
 * - At least 8 characters
 * - Contains at least one letter and one number
 */
export const isValidPassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) {
    return false;
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

/**
 * Middleware: Validates ordinary user registration payload.
 */
export const validateUserRegister = (req, res, next) => {
  const { full_name, email, password } = req.body;

  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
    return next(new ApiError(400, 'Full name is required (minimum 2 characters).'));
  }

  if (!isValidEmail(email)) {
    return next(new ApiError(400, 'A valid email address is required.'));
  }

  if (!isValidPassword(password)) {
    return next(new ApiError(400, 'Password must be at least 8 characters long and contain both letters and numbers.'));
  }

  req.body.full_name = full_name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Middleware: Validates doctor registration payload with all professional fields.
 */
export const validateDoctorRegister = (req, res, next) => {
  const {
    full_name,
    email,
    password,
    degree,
    graduation_year,
    college_name,
    professional_registration_number,
    registration_authority,
    registration_document_url,
    workplace,
    specialization,
    public_phone,
    social_media_url
  } = req.body;

  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
    return next(new ApiError(400, 'Full name is required (minimum 2 characters).'));
  }

  if (!isValidEmail(email)) {
    return next(new ApiError(400, 'A valid email address is required.'));
  }

  if (!isValidPassword(password)) {
    return next(new ApiError(400, 'Password must be at least 8 characters long and contain both letters and numbers.'));
  }

  // Professional details validation
  if (!degree || typeof degree !== 'string' || degree.trim().length === 0) {
    return next(new ApiError(400, 'Medical degree (e.g., MBBS, MD) is required.'));
  }

  const gradYear = parseInt(graduation_year, 10);
  const currentYear = new Date().getFullYear();
  if (isNaN(gradYear) || gradYear < 1950 || gradYear > currentYear) {
    return next(new ApiError(400, `Graduation year must be a valid year between 1950 and ${currentYear}.`));
  }

  if (!college_name || typeof college_name !== 'string' || college_name.trim().length === 0) {
    return next(new ApiError(400, 'College / Medical University name is required.'));
  }

  if (!professional_registration_number || typeof professional_registration_number !== 'string' || professional_registration_number.trim().length === 0) {
    return next(new ApiError(400, 'Professional medical registration number is required.'));
  }

  if (!registration_authority || typeof registration_authority !== 'string' || registration_authority.trim().length === 0) {
    return next(new ApiError(400, 'Medical registration council / authority is required.'));
  }

  if (!workplace || typeof workplace !== 'string' || workplace.trim().length === 0) {
    return next(new ApiError(400, 'Current hospital, clinic, or workplace is required.'));
  }

  if (!specialization || typeof specialization !== 'string' || specialization.trim().length === 0) {
    return next(new ApiError(400, 'Specialization (e.g., Cardiology, General Practice) is required.'));
  }

  // Normalize cleaned fields
  req.body.full_name = full_name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.degree = degree.trim();
  req.body.graduation_year = gradYear;
  req.body.college_name = college_name.trim();
  req.body.professional_registration_number = professional_registration_number.trim();
  req.body.registration_authority = registration_authority.trim();
  req.body.registration_document_url = registration_document_url ? registration_document_url.trim() : null;
  req.body.workplace = workplace.trim();
  req.body.specialization = specialization.trim();
  req.body.public_phone = public_phone ? public_phone.trim() : null;
  req.body.social_media_url = social_media_url ? social_media_url.trim() : null;

  next();
};

/**
 * Middleware: Validates login payload.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Both email and password are required.'));
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Middleware: Validates medication schedule payload.
 */
export const validateSchedule = (req, res, next) => {
  const { medicine_name, dosage_instructions, reminder_times, start_date, end_date } = req.body;

  if (!medicine_name || typeof medicine_name !== 'string' || medicine_name.trim().length === 0) {
    return next(new ApiError(400, 'Medicine name is required.'));
  }

  if (!dosage_instructions || typeof dosage_instructions !== 'string' || dosage_instructions.trim().length === 0) {
    return next(new ApiError(400, 'Dosage instructions provided by your healthcare professional are required.'));
  }

  if (!Array.isArray(reminder_times) || reminder_times.length === 0) {
    return next(new ApiError(400, 'At least one reminder time is required (e.g., ["08:00", "20:00"]).'));
  }

  // Validate time format for each entry
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  const normalizedTimes = [];
  for (const timeStr of reminder_times) {
    if (typeof timeStr !== 'string' || !timeRegex.test(timeStr.trim())) {
      return next(new ApiError(400, `Invalid reminder time format: "${timeStr}". Expected HH:MM or HH:MM:SS.`));
    }
    const parts = timeStr.trim().split(':');
    const hh = parts[0];
    const mm = parts[1];
    const ss = parts[2] || '00';
    normalizedTimes.push(`${hh}:${mm}:${ss}`);
  }

  // Validate start_date and end_date (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!start_date || !dateRegex.test(start_date)) {
    return next(new ApiError(400, 'Start date is required in YYYY-MM-DD format.'));
  }

  if (!end_date || !dateRegex.test(end_date)) {
    return next(new ApiError(400, 'End date is required in YYYY-MM-DD format.'));
  }

  const startDateObj = new Date(start_date);
  const endDateObj = new Date(end_date);

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return next(new ApiError(400, 'Invalid start or end date values.'));
  }

  if (endDateObj < startDateObj) {
    return next(new ApiError(400, 'End date cannot be earlier than start date.'));
  }

  req.body.medicine_name = medicine_name.trim();
  req.body.dosage_instructions = dosage_instructions.trim();
  req.body.reminder_times = normalizedTimes;
  req.body.start_date = start_date;
  req.body.end_date = end_date;

  next();
};
