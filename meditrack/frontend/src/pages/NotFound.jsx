import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC] px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-3xl bg-teal-500/20 blur-xl" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-slate-900 via-teal-800 to-teal-400 flex items-center justify-center shadow-xl shadow-teal-500/20">
            <span className="text-4xl font-black text-white tracking-tight">404</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Return to the clinical dashboard to continue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/15 no-underline"
          >
            Back to Home
          </Link>
          <Link
            to="/instructions"
            className="px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all no-underline"
          >
            Medical Library
          </Link>
        </div>
      </div>
    </div>
  );
}
