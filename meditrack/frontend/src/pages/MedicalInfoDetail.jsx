import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublishedById } from "../services/instructionService";
import PageShell, { ErrorBanner, Spinner, apiErrorMessage } from "../components/PageShell";

const sections = [
  { key: "medical_overview", label: "Medical Overview" },
  { key: "general_usage_information", label: "General Usage Information" },
  { key: "safety_warnings", label: "Safety Warnings", accent: true },
  { key: "when_to_seek_care", label: "When to Seek Care", accent: true },
];

export default function MedicalInfoDetail() {
  const { id } = useParams();
  const [instruction, setInstruction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await getPublishedById(id);
        if (active) setInstruction(response.data?.data || null);
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
  }, [id]);

  return (
    <PageShell badge="Medical Library">
      <Link
        to="/instructions"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900 no-underline mb-6"
      >
        ← Back to the library
      </Link>

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        instruction && (
          <article className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-10">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-800 inline-block mb-4">
              {instruction.condition_name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {instruction.title}
            </h1>
            {instruction.medicine_name && (
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
                Medicine: {instruction.medicine_name}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-6 mb-8 border-b border-slate-200/70 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {instruction.doctor_name || "Certified Physician"}
              </span>
              {instruction.specialization && <span>{instruction.specialization}</span>}
              {instruction.workplace && <span>{instruction.workplace}</span>}
            </div>

            <div className="space-y-8">
              {sections.map(({ key, label, accent }) =>
                instruction[key] ? (
                  <section key={key}>
                    <h2
                      className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                        accent ? "text-rose-600" : "text-teal-700"
                      }`}
                    >
                      {label}
                    </h2>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {instruction[key]}
                    </p>
                  </section>
                ) : null
              )}
            </div>

            <p className="mt-10 pt-6 border-t border-slate-200/70 text-xs text-slate-400 leading-relaxed">
              This guidance is general information authored by a verified clinician. It is not a
              prescription and does not replace a consultation with your own healthcare provider.
            </p>
          </article>
        )
      )}
    </PageShell>
  );
}
