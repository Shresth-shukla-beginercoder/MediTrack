import api from "./api";

// Public Instructions
export const getPublished = () => api.get("/instructions");
export const getPublishedById = (id) => api.get(`/instructions/${id}`);

// Doctor Instructions
export const create = (data) => api.post("/doctor/instructions", data);
export const getById = (id) => api.get(`/doctor/instructions/${id}`);
export const update = (id, data) => api.patch(`/doctor/instructions/${id}`, data);
export const remove = (id) => api.delete(`/doctor/instructions/${id}`);
export const setPublication = (id, publication_status) =>
  api.patch(`/doctor/instructions/${id}/publication`, { publication_status });
