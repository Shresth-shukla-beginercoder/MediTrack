import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="absolute top-0 -left-40 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Verified Clinical Protocols • MediTrack
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Precision Healthcare at{" "}
              <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                Every Dose.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl font-normal leading-relaxed">
              Synchronize patient treatment schedules, doctor-validated medical
              instructions, and clinical safety alerts in one streamlined digital
              ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                to="/user/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-all duration-200 shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 hover:-translate-y-0.5 no-underline"
              >
                <span>Start Patient Plan</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                to="/instructions"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm no-underline"
              >
                Browse Medical Library
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 border border-slate-100 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Today&apos;s Protocol
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    Verified Physician Regimen
                  </span>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded-full border border-teal-200">
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Rx
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Amoxicillin Trihydrate
                    </h4>
                    <span className="text-xs text-slate-500">
                      500mg • Post-Meal • With Water
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                    08:00 AM
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Rx
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Atorvastatin Calcium
                    </h4>
                    <span className="text-xs text-slate-500">
                      20mg • Evening Intake
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                    08:30 PM
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Rx
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Vitamin D3 Cholecalciferol
                    </h4>
                    <span className="text-xs text-slate-500">
                      1000 IU • Once Daily
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                    12:00 PM
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
