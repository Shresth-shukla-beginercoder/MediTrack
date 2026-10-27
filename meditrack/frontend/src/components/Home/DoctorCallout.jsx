import { Link } from "react-router-dom";

export default function DoctorCallout() {
  return (
    <section className="py-20 bg-linear-to-br from-slate-950 via-[#0A1320] to-slate-900 text-white relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/3 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
              For Healthcare Practitioners
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Publish Protocols & Oversee Patient Adherence
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Join a nationwide network of verified physicians. Publish certified medical
              instructions, monitor pharmacological compliance, and update patient
              guidance in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              to="/doctor/register"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl bg-teal-400 text-slate-950 font-bold text-sm hover:bg-teal-300 shadow-xl shadow-teal-500/20 transition-all duration-200 no-underline"
            >
              Register as Doctor
            </Link>
            <Link
              to="/doctor/login"
              className="w-full sm:w-auto text-center px-6 py-4 rounded-2xl bg-transparent border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors no-underline"
            >
              Doctor Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
