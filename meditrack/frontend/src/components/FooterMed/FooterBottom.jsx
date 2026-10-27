function FooterBottom() {
  return (
    <div className="pt-8 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-slate-400 font-normal">
        © {new Date().getFullYear()} MediTrack Technologies Inc. Medical protocols subject to certified clinical review.
      </p>

      <div className="flex items-center gap-6 text-slate-400">
        <a href="#privacy" className="hover:text-teal-400 transition-colors no-underline">
          Privacy Policy
        </a>
        <a href="#terms" className="hover:text-teal-400 transition-colors no-underline">
          Terms of Service
        </a>
        <a href="#compliance" className="hover:text-teal-400 transition-colors no-underline">
          HIPAA & GDPR Attestation
        </a>
      </div>
    </div>
  );
}

export default FooterBottom;
