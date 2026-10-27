import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublished } from "../services/instructionService";
import PageShell, { ErrorBanner, Spinner, EmptyState, apiErrorMessage } from "../components/PageShell";

export default function MedicalInfoList() {
  const [instructions, setInstructions] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPublished();
      setInstructions(response.data?.data || []);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load the medical library."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = instructions.filter((item) => {
    const haystack = `${item.title} ${item.condition_name} ${item.medicine_name} ${item.doctor_name}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <PageShell
      wide
      badge="Medical Library"
      title="Doctor-Authored Instructions"
      subtitle="Medically reviewed guidance published by verified healthcare professionals. This is general information and does not replace advice from your own physician."
    >
      <div className="mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by condition, medicine, or doctor..."
          className="w-full max-w-lg px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 shadow-sm transition-all"
        />
      </div>

      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={instructions.length === 0 ? "No published instructions yet" : "Nothing matches your search"}
          text={
            instructions.length === 0
              ? "Verified physicians have not published any guidance yet. Check back soon."
              : "Try a different condition, medicine, or doctor name."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.instruction_id}
              className="p-6 rounded-3xl bg-white border border-slate-200/70 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-800 w-fit mb-3 inline-block">
                  {item.condition_name || "Clinical Protocol"}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h2>
                {item.medicine_name && (
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {item.medicine_name}
                  </p>
                )}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {item.medical_overview}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 text-xs text-slate-500">
                <div className="font-semibold text-slate-700">
                  <span className="block">{item.doctor_name || "Certified Physician"}</span>
                  {item.specialization && (
                    <span className="block font-normal text-slate-400">{item.specialization}</span>
                  )}
                </div>
                <Link
                  to={`/instructions/${item.instruction_id}`}
                  className="text-teal-700 font-bold hover:underline no-underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
