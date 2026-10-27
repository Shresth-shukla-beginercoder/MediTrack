import { useState, useEffect } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulated smooth progress for a polished loading feel
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 22, 92));
    }, 150);

    const done = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
    }, 1600);

    const fadeStart = setTimeout(() => setFading(true), 1750);
    const hide = setTimeout(() => setVisible(false), 2300);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
      clearTimeout(fadeStart);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* soft radial glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* pulsing cross mark */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-teal-500/30 blur-lg animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-tr from-slate-900 via-teal-800 to-teal-400 flex items-center justify-center shadow-xl shadow-teal-500/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-9 h-9 text-white"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-6">
          Medi<span className="text-teal-600">Track</span>
        </h1>

        {/* progress bar */}
        <div className="w-56 h-1.5 rounded-full bg-slate-200 overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-500 to-sky-500 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Preparing clinical systems...
        </p>
      </div>
    </div>
  );
}
