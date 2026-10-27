import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createSchedule,
  getScheduleById,
  updateSchedule,
} from "../services/scheduleService";
import PageShell, { ErrorBanner, Spinner, apiErrorMessage } from "../components/PageShell";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all";
const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-700";

const emptyForm = {
  medicine_name: "",
  dosage_instructions: "",
  reminder_times: "08:00",
  start_date: "",
  end_date: "",
};

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toTimeInput(value) {
  return String(value).slice(0, 5);
}

export default function ScheduleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    let active = true;

    async function load() {
      try {
        const response = await getScheduleById(id);
        const schedule = response.data?.schedule;
        if (active && schedule) {
          const times = Array.isArray(schedule.reminder_times)
            ? schedule.reminder_times.map(toTimeInput).join(", ")
            : "";
          setForm({
            medicine_name: schedule.medicine_name || "",
            dosage_instructions: schedule.dosage_instructions || "",
            reminder_times: times,
            start_date: toDateInput(schedule.start_date),
            end_date: toDateInput(schedule.end_date),
          });
        }
      } catch (err) {
        if (active) setError(apiErrorMessage(err, "Could not load this schedule."));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const reminderTimes = form.reminder_times
      .split(",")
      .map((time) => time.trim())
      .filter(Boolean);

    if (reminderTimes.length === 0) {
      setError("Add at least one reminder time, like 08:00.");
      return;
    }

    const payload = {
      medicine_name: form.medicine_name.trim(),
      dosage_instructions: form.dosage_instructions.trim(),
      reminder_times: reminderTimes,
      start_date: form.start_date,
      end_date: form.end_date,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateSchedule(id, payload);
      } else {
        await createSchedule(payload);
      }
      navigate("/user/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save this schedule."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      badge="Patient Portal"
      title={isEditing ? "Edit Schedule" : "New Medication Schedule"}
      subtitle="Record what you take, how you take it, and when you need a reminder. Times use 24-hour format, for example 08:00 or 20:30."
    >
      <Link
        to="/user/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900 no-underline mb-6"
      >
        ← Back to my schedules
      </Link>

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-10 space-y-5 max-w-2xl"
        >
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="medicine_name">
              Medicine Name
            </label>
            <input
              id="medicine_name"
              name="medicine_name"
              type="text"
              required
              value={form.medicine_name}
              onChange={handleChange}
              placeholder="e.g. Metformin"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="dosage_instructions">
              Dosage Instructions
            </label>
            <textarea
              id="dosage_instructions"
              name="dosage_instructions"
              required
              rows={3}
              value={form.dosage_instructions}
              onChange={handleChange}
              placeholder="e.g. One 500mg tablet with breakfast, as directed by your doctor"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="reminder_times">
              Reminder Times
            </label>
            <input
              id="reminder_times"
              name="reminder_times"
              type="text"
              required
              value={form.reminder_times}
              onChange={handleChange}
              placeholder="08:00, 20:00"
              className={inputClass}
            />
            <span className="text-xs text-slate-400">
              Separate multiple times with commas. Use HH:MM, such as 08:00.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="start_date">
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                required
                value={form.start_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} htmlFor="end_date">
                End Date
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                required
                value={form.end_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Schedule"}
          </button>
        </form>
      )}
    </PageShell>
  );
}
