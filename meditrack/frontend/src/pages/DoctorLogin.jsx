import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PasswordInput from "../components/PasswordInput";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const result = await login(email, password, "doctor");
      if (result.success) {
        const destination = location.state?.from?.pathname || "/doctor/dashboard";
        navigate(destination, { replace: true });
      } else {
        setFormError(result.message || "Invalid doctor credentials.");
      }
    } catch {
      setFormError("Failed to authenticate. Please check network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full bg-slate-950/80 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 text-white backdrop-blur-xl">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/20">
            Clinician Gateway
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Physician Portal</h1>
          <p className="text-sm text-slate-400 mt-2">
            Sign in to author medication instructions and oversee care.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="email">
              Medical Practitioner Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dr.name@hospital.org"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-teal-400 focus:bg-slate-900/90 transition-all placeholder-slate-600"
            />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dark
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-bold text-sm bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/20 transition-all duration-200 mt-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Verifying..." : "Access Doctor Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need to register your medical practice?
          <Link to="/doctor/register" className="font-bold text-teal-400 hover:text-teal-300 no-underline ml-1">
            Submit Credentials
          </Link>
        </p>
      </div>
    </div>
  );
}
