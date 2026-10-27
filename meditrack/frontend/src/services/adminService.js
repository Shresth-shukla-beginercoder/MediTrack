import api from "./api";

// GET /admin/me → { admin }
export const getMe = () => api.get("/admin/me");

// GET /admin/doctors?verificationStatus= → { count, doctors }
export const listDoctors = (verificationStatus) =>
  api.get("/admin/doctors", {
    params: verificationStatus ? { verificationStatus } : {},
  });

// GET /admin/doctors/:id → { doctor }
export const getDoctorDetails = (id) => api.get(`/admin/doctors/${id}`);

// PATCH /admin/doctors/:id/review — { status, admin_message? }
// status must be "approved", "rejected", or "suspended".
export const reviewDoctor = (id, status, adminMessage) =>
  api.patch(`/admin/doctors/${id}/review`, {
    status,
    admin_message: adminMessage || null,
  });

// PATCH /admin/doctors/:id/request-information — { admin_message }
// resets the doctor back to "pending".
export const requestInformation = (id, adminMessage) =>
  api.patch(`/admin/doctors/${id}/request-information`, {
    admin_message: adminMessage,
  });

// PATCH /admin/doctors/:id/verification-status — { status, admin_message }
export const updateVerificationStatus = (id, status, adminMessage) =>
  api.patch(`/admin/doctors/${id}/verification-status`, {
    status,
    admin_message: adminMessage || null,
  });
