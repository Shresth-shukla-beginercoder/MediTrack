import api from "./api";

// GET /users/me → { user }
export const getProfile = () => api.get("/users/me");

// PATCH /users/me — { full_name, email } → { user }
export const updateProfile = (profile) => api.patch("/users/me", profile);
