import { useState } from "react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="max-w-sm flex flex-col gap-3">
      <h4 className="text-white font-bold text-sm tracking-wide">Clinical Updates & Research</h4>
      <p className="text-slate-400 text-xs leading-relaxed">
        Subscribe to receive protocol alerts, digital pharmacology advisories, and platform updates.
      </p>

      {subscribed ? (
        <div className="p-3 bg-teal-950/70 border border-teal-500/30 rounded-xl text-teal-300 text-xs">
          ✓ Successfully subscribed to clinical dispatch.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter clinical email..."
            required
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 w-full transition-colors"
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
