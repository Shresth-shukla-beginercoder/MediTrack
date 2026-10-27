function FooterBrand() {
  return (
    <div className="max-w-sm flex flex-col gap-4">
      <div className="flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
          Medi<span className="text-teal-400">Track</span>
        </span>
      </div>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
        Next-generation digital therapeutics, doctor-led clinical protocols, and intelligent medication adherence architecture.
      </p>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 w-fit">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Clinical Systems Active • 99.99% Reliability</span>
      </div>
    </div>
  );
}

export default FooterBrand;
