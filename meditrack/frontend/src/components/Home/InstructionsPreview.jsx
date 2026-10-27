import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const fallbackInstructions = [
  {
    instruction_id: "demo-1",
    title: "Hypertension: ACE Inhibitor Protocol",
    condition_name: "Hypertension",
    medical_overview: "Guidelines on optimal morning dosage, water intake, electrolyte monitoring, and blood pressure logging.",
    doctor_name: "Dr. Alexander Wright, MD",
  },
  {
    instruction_id: "demo-2",
    title: "Post-Operative Antibiotic Management",
    condition_name: "Post-Operative Care",
    medical_overview: "Crucial instructions on completing the full course of oral antibiotics with probiotic scheduling.",
    doctor_name: "Dr. Elena Rostova, MD",
  },
  {
    instruction_id: "demo-3",
    title: "Type 2 Glycemic Stabilization",
    condition_name: "Type 2 Diabetes",
    medical_overview: "Standard operating procedures for metformin intake in relation to meal timing and blood glucose tracking.",
    doctor_name: "Dr. Marcus Chen, MD",
  },
];

export default function InstructionsPreview() {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstructions() {
      try {
        const response = await api.get("/instructions");
        const list = response.data?.data || response.data?.instructions || [];
        if (list.length > 0) {
          setInstructions(list.slice(0, 3));
        } else {
          setInstructions(fallbackInstructions);
        }
      } catch {
        setInstructions(fallbackInstructions);
      } finally {
        setLoading(false);
      }
    }
    fetchInstructions();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-200/60">
              Live Medical Insights
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor-Authored Instructions
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Browse medically reviewed guidance published by certified healthcare professionals.
            </p>
          </div>

          <Link
            to="/instructions"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors no-underline"
          >
            <span>View Full Medical Library</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructions.map((item) => (
              <div
                key={item.instruction_id || item.id}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-800 w-fit mb-3 inline-block">
                    {item.condition_name || item.category || "Clinical Protocol"}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {item.medical_overview || item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 text-xs text-slate-500">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-teal-600"
                    >
                      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                    </svg>
                    <span>{item.doctor_name || item.author || "Certified Physician"}</span>
                  </div>

                  <Link
                    to={`/instructions/${item.instruction_id || item.id}`}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
