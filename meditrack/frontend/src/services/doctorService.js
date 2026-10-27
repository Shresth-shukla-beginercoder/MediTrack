import api from "./api";

export const getProfile = () => api.get("/doctor/profile");
export const updateProfile = (data) => api.patch("/doctor/profile", data);
export const getVerificationStatus = () => api.get("/doctor/verification-status");
export const updateCredentials = (data) => api.patch("/doctor/credentials", data);
export const getInstructions = () => api.get("/doctor/instructions");
