import api from "./api";

// reminder_times must be an array of "HH:MM" strings;
// start_date and end_date must be "YYYY-MM-DD".

// POST /schedules → 201 { schedule }
export const createSchedule = (schedule) => api.post("/schedules", schedule);

// GET /schedules → { count, schedules }
export const getMySchedules = () => api.get("/schedules");

// GET /schedules/:id → { schedule }
export const getScheduleById = (id) => api.get(`/schedules/${id}`);

// PATCH /schedules/:id → { schedule }
export const updateSchedule = (id, schedule) =>
  api.patch(`/schedules/${id}`, schedule);

// DELETE /schedules/:id → { deletedScheduleId }
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);
