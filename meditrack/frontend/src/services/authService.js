import api from "./api";

// POST /auth/login — role is optional; pass it to avoid the
// "multiple account types match this email" ambiguity error.
export const login = (email, password, role) => {
  const payload = { email, password };
  if (role) payload.role = role;
  return api.post("/auth/login", payload);
};

// POST /auth/register/user — { full_name, email, password }
export const registerUser = (userData) =>
  api.post("/auth/register/user", userData);

// POST /auth/register/doctor — full credential payload
export const registerDoctor = (doctorData) =>
  api.post("/auth/register/doctor", doctorData);

// GET /auth/me — the logged-in account's profile
export const getMe = () => api.get("/auth/me");
