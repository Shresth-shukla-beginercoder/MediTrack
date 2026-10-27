import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PasswordInput from "../components/PasswordInput";

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    degree: "",
    graduation_year: "",
    college_name: "",
    professional_registration_number: "",
    registration_authority: "",
    workplace: "",
    specialization: "",
    public_phone: "",
    social_media_url: "",
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-teal-400 transition-all placeholder-slate-600";
  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-slate-300";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerDoctor({
        ...formData,
        graduation_year: Number(formData.graduation_year),
      });

      if (result.success) {
        navigate("/doctor/dashboard");
      } else {
        setFormError(result.message || "Failed to register doctor profile.");
      }
    } catch {
      setFormError("Network or server error during registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-950/90 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 text-white backdrop-blur-xl">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/20">
            Physician Credentialing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Join MediTrack Clinical Network
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Register your credentials to publish verified medication guidance and clinical protocols.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 pt-2 pb-1 border-b border-slate-800 mb-4 flex items-center gap-2">
              <span>1. Account Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="full_name">
                  Full Name with Title
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Dr. Sarah Jenkins, MD"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="email">
                  Professional Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="s.jenkins@clinic.org"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <PasswordInput
                id="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                dark
              />

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="public_phone">
                  Contact Phone (Optional)
                </label>
                <input
                  id="public_phone"
                  name="public_phone"
                  type="tel"
                  value={formData.public_phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 pt-2 pb-1 border-b border-slate-800 mb-4 flex items-center gap-2">
              <span>2. Medical Education & Licensing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="degree">
                  Medical Degree
                </label>
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  required
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. MD, MBBS, DO"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="graduation_year">
                  Graduation Year
                </label>
                <input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  min="1950"
                  max="2030"
                  required
                  value={formData.graduation_year}
                  onChange={handleChange}
                  placeholder="2016"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label className={labelClass} htmlFor="college_name">
                Medical College / University
              </label>
              <input
                id="college_name"
                name="college_name"
                type="text"
                required
                value={formData.college_name}
                onChange={handleChange}
                placeholder="Johns Hopkins School of Medicine"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="professional_registration_number">
                  Registration / License Number
                </label>
                <input
                  id="professional_registration_number"
                  name="professional_registration_number"
                  type="text"
                  required
                  value={formData.professional_registration_number}
                  onChange={handleChange}
                  placeholder="e.g. MED-849204"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="registration_authority">
                  Licensing Medical Council / Authority
                </label>
                <input
                  id="registration_authority"
                  name="registration_authority"
                  type="text"
                  required
                  value={formData.registration_authority}
                  onChange={handleChange}
                  placeholder="State Medical Board"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 pt-2 pb-1 border-b border-slate-800 mb-4 flex items-center gap-2">
              <span>3. Practice & Specialization</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="specialization">
                  Primary Specialty
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Cardiology, Internal Medicine"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="workplace">
                  Current Hospital / Clinical Practice
                </label>
                <input
                  id="workplace"
                  name="workplace"
                  type="text"
                  required
                  value={formData.workplace}
                  onChange={handleChange}
                  placeholder="Metropolitan Health Institute"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-4 rounded-xl text-slate-950 font-bold text-sm bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/20 transition-all duration-200 mt-4 cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Submitting for Verification..." : "Submit Doctor Registration"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already credentialed?
          <Link to="/doctor/login" className="font-bold text-teal-400 hover:text-teal-300 no-underline ml-1">
            Doctor Login
          </Link>
        </p>
      </div>
    </div>
  );
}
