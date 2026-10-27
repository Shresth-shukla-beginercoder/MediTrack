import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as adminService from "../services/adminService";
import PageShell, {
  ErrorBanner,
  SuccessBanner,
  Spinner,
  apiErrorMessage,
} from "../components/PageShell";

const filters = ["all", "pending", "approved", "rejected", "suspended"];
const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-700",
  suspended: "bg-slate-200 text-slate-600",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value).slice(0, 10)
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actingId, setActingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState(null);

  const load = useCallback(async (status = "all") => {
    setLoading(true);
    setError("");
    try {
      const response = await adminService.listDoctors(status === "all" ? undefined : status);
      setDoctors(response.data?.doctors || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load the doctor list."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFilter = (value) => {
    setFilter(value);
    setExpandedId(null);
    load(value);
  };

  const toggleExpand = async (doctor) => {
    if (expandedId === doctor.doctor_id) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(doctor.doctor_id);
    setExpandedDetail(null);
    try {
      const response = await adminService.getDoctorDetails(doctor.doctor_id);
      setExpandedDetail(response.data?.doctor || doctor);
    } catch {
      setExpandedDetail(doctor);
    }
  };

  const runAction = async (doctor, status, message) => {
    setActingId(doctor.doctor_id);
    setError("");
    setSuccess("");
    try {
      await adminService.reviewDoctor(doctor.doctor_id, status, message);
      setDoctors((prev) =>
        prev.map((item) =>
          item.doctor_id === doctor.doctor_id
            ? { ...item, verification_status: status, admin_message: message || null }
            : item
        )
      );
      setSuccess(`${doctor.full_name} ${status}.`);
      const expanded = expandedDetail?.doctor_id === doctor.doctor_id ? expandedDetail : doctor;
      setExpandedDetail({ ...expanded, verification_status: status, admin_message: message || null });
    } catch (err) {
      setError(apiErrorMessage(err, "The action could not be completed."));
    } finally {
      setActingId(null);
    }
  };

  const handleRequestInfo = async (doctor) => {
    const message = window.prompt(
      "Message to send to this doctor requesting additional information:",
      ""
    );
    if (message === null) return;
    if (!message.trim()) {
      setError("A message is required to request information.");
      return;
    }
    setActingId(doctor.doctor_id);
    setError("");
    setSuccess("");
    try {
      await adminService.requestInformation(doctor.doctor_id, message.trim());
      setDoctors((prev) =>
        prev.map((item) =>
          item.doctor_id === doctor.doctor_id
            ? { ...item, verification_status: "pending", admin_message: message.trim() }
            : item
        )
      );
      setSuccess(`Information requested from ${doctor.full_name}.`);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not request information."));
    } finally {
      setActingId(null);
    }
  };

  const reviewActions = (status) =>
    [
      { label: "Approve", target: "approved", tone: "text-emerald-700 hover:text-emerald-900" },
      { label: "Reject", target: "rejected", tone: "text-rose-600 hover:text-rose-800" },
      { label: "Suspend", target: "suspended", tone: "text-slate-500 hover:text-slate-700" },
    ].filter((action) => action.target !== status);

  return (
    <PageShell
      wide
      badge="Administration"
      title={`Reviewing Clinicians${user?.fullName ? ` — ${user.fullName}` : ""}`}
      subtitle="Approve, reject, or suspend clinician credentials and request additional information when needed."
    >
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => toggleFilter(value)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filter === value
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <SuccessBanner message={success} />
      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : doctors.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2">No doctors in this view</h3>
          <p className="text-sm text-slate-500">
            There are no clinicians with the “{filter}” status right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor) => {
            const detail = expandedId === doctor.doctor_id ? expandedDetail || doctor : null;
            const busy = actingId === doctor.doctor_id;
            return (
              <div
                key={doctor.doctor_id}
                className="rounded-3xl bg-white border border-slate-200/70 shadow-sm overflow-hidden"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(doctor)}
                    className="text-left cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-800 to-teal-400 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-lg">
                        {doctor.full_name?.trim().split(" ")[0]?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 truncate">{doctor.full_name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            statusStyles[doctor.verification_status] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {doctor.verification_status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {doctor.specialization} · {doctor.workplace}
                      </p>
                    </div>
                    <span className="text-slate-300 ml-2 rotate-180 transition-transform">
                      {expandedId === doctor.doctor_id ? "▸" : "▾"}
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold shrink-0">
                    {reviewActions(doctor.verification_status).map((action) => (
                      <button
                        key={action.target}
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          runAction(doctor, action.target, window.prompt("Optional note to the doctor:", "") || "")
                        }
                        className={`cursor-pointer disabled:opacity-40 ${action.tone}`}
                      >
                        {action.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleRequestInfo(doctor)}
                      className="cursor-pointer disabled:opacity-40 text-teal-700 hover:text-teal-900"
                    >
                      Request Info
                    </button>
                  </div>
                </div>

                {detail && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/60">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm py-4">
                      <DetailField label="Email" value={detail.email} />
                      <DetailField label="Degree" value={detail.degree} />
                      <DetailField label="Graduated" value={detail.graduation_year} />
                      <DetailField label="College" value={detail.college_name} />
                      <DetailField label="Reg. Number" value={detail.professional_registration_number} />
                      <DetailField label="Authority" value={detail.registration_authority} />
                      <DetailField label="Contact" value={detail.public_phone} />
                      <DetailField label="Registered" value={formatDate(detail.created_at)} />
                      <DetailField label="Reviewed" value={formatDate(detail.reviewed_at)} />
                    </div>
                    {detail.admin_message && (
                      <p className="text-sm text-slate-500 mb-3">
                        <span className="font-bold text-slate-700">Last note:</span> {detail.admin_message}
                      </p>
                    )}
                    {detail.registration_document_url && (
                      <a
                        href={detail.registration_document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-teal-700 hover:text-teal-900"
                      >
                        Open registration document ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-xs text-slate-400">
        Showing {doctors.length} {filter === "all" ? "clinicians" : `${filter} clinician(s)`}.
      </div>
    </PageShell>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
        {label}
      </dt>
      <dd className="text-slate-700 break-words">{value || "—"}</dd>
    </div>
  );
}
