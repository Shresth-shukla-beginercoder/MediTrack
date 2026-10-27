import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as doctorService from "../services/doctorService";
import { setPublication, remove as deleteInstruction } from "../services/instructionService";
import PageShell, { ErrorBanner, Spinner, EmptyState, apiErrorMessage } from "../components/PageShell";

const statusStyles = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  suspended: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [instructions, setInstructions] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statusRes, instrRes] = await Promise.all([
        doctorService.getVerificationStatus(),
        doctorService.getInstructions(),
      ]);
      setStatus(statusRes.data?.status || null);
      setInstructions(instrRes.data?.instructions || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async (instruction, target) => {
    setActingId(instruction.instruction_id);
    setError("");
    try {
      await setPublication(instruction.instruction_id, target);
      setInstructions((prev) =>
        prev.map((item) =>
          item.instruction_id === instruction.instruction_id
            ? { ...item, publication_status: target }
            : item
        )
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update the publication status."));
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (instruction) => {
    const confirmed = window.confirm(`Delete "${instruction.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setActingId(instruction.instruction_id);
    setError("");
    try {
      await deleteInstruction(instruction.instruction_id);
      setInstructions((prev) =>
        prev.filter((item) => item.instruction_id !== instruction.instruction_id)
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete that instruction."));
    } finally {
      setActingId(null);
    }
  };

  const published = instructions.filter((i) => i.publication_status === "published").length;
  const drafts = instructions.length - published;
  const isApproved = status?.verification_status === "approved";

  return (
    <PageShell
      wide
      badge="Clinician Portal"
      title={`Welcome${user?.fullName ? `, ${user.fullName}` : ""}`}
      subtitle="Author, publish, and manage the medication guidance you share with patients."
      actions={
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/doctor/profile"
            className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all no-underline"
          >
            Edit Profile
          </Link>
          <Link
            to="/doctor/instructions/new"
            className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/15 no-underline"
          >
            + New Instruction
          </Link>
        </div>
      }
    >
      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-8">
          {/* Verification status */}
          <div
            className={`rounded-3xl border p-6 ${
              statusStyles[status?.verification_status] || "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold capitalize">
                  Verification: {status?.verification_status || "unknown"}
                </h2>
                {status?.admin_message && (
                  <p className="text-sm mt-1 opacity-80">{status.admin_message}</p>
                )}
              </div>
              {!isApproved && (
                <span className="text-xs font-semibold opacity-70">
                  Publishing is available once your credentials are approved.
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total", value: instructions.length },
              { label: "Published", value: published },
              { label: "Drafts", value: drafts },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-white border border-slate-200/70 p-5 text-center shadow-sm"
              >
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions list */}
          {instructions.length === 0 ? (
            <EmptyState
              title="No instructions yet"
              text="Write your first medication instruction to add it to your clinical library."
              action={
                <Link
                  to="/doctor/instructions/new"
                  className="inline-block px-6 py-3 rounded-2xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all no-underline"
                >
                  Write an instruction
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {instructions.map((instruction) => {
                const isPublished = instruction.publication_status === "published";
                const busy = actingId === instruction.instruction_id;
                return (
                  <div
                    key={instruction.instruction_id}
                    className="p-6 rounded-3xl bg-white border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {instruction.publication_status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {instruction.condition_name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {instruction.title}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {instruction.medical_overview}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm font-bold shrink-0">
                      <Link
                        to={`/doctor/instructions/${instruction.instruction_id}`}
                        className="text-teal-700 hover:text-teal-900 no-underline"
                      >
                        Edit
                      </Link>

                      {isApproved && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handlePublish(instruction, isPublished ? "draft" : "published")}
                          className="cursor-pointer disabled:opacity-50 text-slate-700 hover:text-slate-900"
                        >
                          {isPublished ? "Withdraw" : "Publish"}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(instruction)}
                        className="cursor-pointer disabled:opacity-50 text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
