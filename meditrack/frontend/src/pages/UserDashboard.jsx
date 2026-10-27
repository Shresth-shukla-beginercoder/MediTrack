import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getMySchedules, deleteSchedule } from "../services/scheduleService";
import PageShell, {
  ErrorBanner,
  Spinner,
  EmptyState,
  apiErrorMessage,
} from "../components/PageShell";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function reminderList(reminderTimes) {
  if (!Array.isArray(reminderTimes)) return [];
  return reminderTimes.map((time) => String(time).slice(0, 5));
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMySchedules();
      setSchedules(response.data?.schedules || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load your medication schedules."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (schedule) => {
    const confirmed = window.confirm(
      `Delete the schedule for ${schedule.medicine_name}? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(schedule.schedule_id);
    setError("");
    try {
      await deleteSchedule(schedule.schedule_id);
      setSchedules((prev) =>
        prev.filter((item) => item.schedule_id !== schedule.schedule_id)
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Could not delete that schedule."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageShell
      wide
      badge="Patient Portal"
      title={`Welcome${user?.fullName ? `, ${user.fullName}` : ""}`}
      subtitle="Your private medication schedules and reminders. Only you can see them."
      actions={
        <Link
          to="/user/schedules/new"
          className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/15 no-underline"
        >
          + New Schedule
        </Link>
      }
    >
      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <Spinner />
      ) : schedules.length === 0 ? (
        <EmptyState
          title="No medication schedules yet"
          text="Create a schedule to track a medicine, its dosage, and the times you need to take it."
          action={
            <Link
              to="/user/schedules/new"
              className="inline-block px-6 py-3 rounded-2xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all no-underline"
            >
              Create your first schedule
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.schedule_id}
              className="p-6 rounded-3xl bg-white border border-slate-200/70 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {schedule.medicine_name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {schedule.dosage_instructions}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {reminderList(schedule.reminder_times).map((time) => (
                  <span
                    key={time}
                    className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/60"
                  >
                    {time}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 mb-5">
                {formatDate(schedule.start_date)} → {formatDate(schedule.end_date)}
              </p>

              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-slate-200/60 text-sm font-bold">
                <Link
                  to={`/user/schedules/${schedule.schedule_id}`}
                  className="text-teal-700 hover:text-teal-900 no-underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(schedule)}
                  disabled={deletingId === schedule.schedule_id}
                  className="text-rose-600 hover:text-rose-800 cursor-pointer disabled:opacity-50"
                >
                  {deletingId === schedule.schedule_id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
