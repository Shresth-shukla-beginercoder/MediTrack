export default function StatsBanner() {
  const stats = [
    { value: "100%", label: "Doctor-Verified Guidelines" },
    { value: "24/7", label: "Intelligent Schedule Alerts" },
    { value: "99.9%", label: "Dose Compliance Rate" },
    { value: "HIPAA", label: "Clinical Privacy Standards" },
  ];

  return (
    <section className="py-12 border-y border-slate-200/60 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
