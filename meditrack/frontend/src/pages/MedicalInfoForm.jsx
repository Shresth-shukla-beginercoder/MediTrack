import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as instructionService from "../services/instructionService";
import PageShell, { ErrorBanner, Spinner, apiErrorMessage } from "../components/PageShell";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all";
const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-700";

const emptyForm = {
  condition_name: "",
  title: "",
  medical_overview: "",
  medicine_name: "",
  general_usage_information: "",
  safety_warnings: "",
  when_to_seek_care: "",
};

export default function MedicalInfoForm() {
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
        const response = await instructionService.getById(id);
        const instruction = response.data?.instruction || {};
        if (active) {
          setForm({
            condition_name: instruction.condition_name || "",
            title: instruction.title || "",
            medical_overview: instruction.medical_overview || "",
            medicine_name: instruction.medicine_name || "",
            general_usage_information: instruction.general_usage_information || "",
            safety_warnings: instruction.safety_warnings || "",
            when_to_seek_care: instruction.when_to_seek_care || "",
          });
        }
      } catch (err) {
        if (active) setError(apiErrorMessage(err, "Could not load this instruction."));
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        condition_name: form.condition_name.trim(),
        title: form.title.trim(),
        medical_overview: form.medical_overview.trim(),
        medicine_name: form.medicine_name.trim(),
        general_usage_information: form.general_usage_information.trim(),
        safety_warnings: form.safety_warnings.trim(),
        when_to_seek_care: form.when_to_seek_care.trim(),
      };

      if (isEditing) {
        await instructionService.update(id, payload);
      } else {
        await instructionService.create(payload);
      }
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save this instruction."));
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { key: "condition_name", label: "Condition", type: "text", required: true },
    { key: "title", label: "Instruction Title", type: "text", required: true },
    { key: "medicine_name", label: "Medicine Name", type: "text" },
    { key: "medical_overview", label: "Medical Overview", type: "textarea" },
    { key: "general_usage_information", label: "General Usage Information", type: "textarea" },
    { key: "safety_warnings", label: "Safety Warnings", type: "textarea" },
    { key: "when_to_seek_care", label: "When to Seek Care", type: "textarea" },
  ];

  return (
    <PageShell
      badge="Clinician Portal"
      title={isEditing ? "Edit Instruction" : "New Instruction"}
      subtitle="Draft medication guidance for patients. New instructions are saved as drafts and stay private until you publish one."
    >
      <Link
        to="/doctor/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900 no-underline mb-6"
      >
        ← Back to dashboard
      </Link>

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-10 space-y-5 max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields
              .filter((f) => f.type === "text")
              .map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className={labelClass} htmlFor={field.key}>
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    name={field.key}
                    type={field.type}
                    required={field.required}
                    value={form[field.key]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              ))}
          </div>

          {fields
            .filter((f) => f.type === "textarea")
            .map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor={field.key}>
                  {field.label}
                </label>
                <textarea
                  id={field.key}
                  name={field.key}
                  rows={3}
                  value={form[field.key]}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save as Draft"}
            </button>
            <Link
              to="/doctor/dashboard"
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 no-underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </PageShell>
  );
}
