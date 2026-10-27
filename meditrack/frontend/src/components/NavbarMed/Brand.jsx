import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 no-underline group">
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-sky-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-900 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 group-hover:shadow-teal-500/35 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-white"
          >
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
          Medi<span className="text-teal-600">Track</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
          Clinical Systems
        </span>
      </div>
    </Link>
  );
}
