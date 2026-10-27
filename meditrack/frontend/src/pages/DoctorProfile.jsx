import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as doctorService from "../services/doctorService";
import PageShell, {
  ErrorBanner,
  SuccessBanner,
  Spinner,
  apiErrorMessage,
} from "../components/PageShell";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all";
const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-700";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    registration_authority: "",
    workplace: "",
    specialization: "",
    public_phone: "",
    social_media_url: "",
  });
  const [credForm, setCredForm] = useState({
    degree: "",
    graduation_year: "",
    college_name: "",
    professional_registration_number: "",
    registration_authority: "",
    registration_document_url: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCred, setSavingCred] = useState(false);
  const [error, setError] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [credMsg, setCredMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileRes, verRes] = await Promise.all([
        doctorService.getProfile(),
        doctorService.getVerificationStatus(),
      ]);
      const doctor = profileRes.data?.doctor || {};
      setProfile(doctor);
      setVerification(verRes.data?.status || null);
      setProfileForm({
        full_name: doctor.full_name || "",
        registration_authority: doctor.registration_authority || "",
        workplace: doctor.workplace || "",
        specialization: doctor.specialization || "",
        public_phone: doctor.public_phone || "",
        social_media_url: doctor.social_media_url || "",
      });
      setCredForm({
        degree: doctor.degree || "",
        graduation_year: doctor.graduation_year ? String(doctor.graduation_year) : "",
        college_name: doctor.college_name || "",
        professional_registration_number:
          doctor.professional_registration_number || "",
        registration_authority: doctor.registration_authority || "",
        registration_document_url: doctor.registration_document_url || "",
      });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setSavingProfile(true);
    setError("");
    try {
      const response = await doctorService.updateProfile(profileForm);
      setProfile(response.data?.doctor || null);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const submitCredentials = async (e) => {
    e.preventDefault();
    setCredMsg("");
    setSavingCred(true);
    setError("");
    try {
      await doctorService.updateCredentials({
        ...credForm,
        graduation_year: Number(credForm.graduation_year) || null,
      });
      setCredMsg("Credentials updated successfully.");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update your credentials."));
    } finally {
      setSavingCred(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <PageShell
      badge="Clinician Portal"
      title="Profile & Credentials"
      subtitle="Keep your professional details accurate. Changes to credentials may be re-reviewed before publishing is enabled."
      actions={
        <Link
          to="/doctor/dashboard"
          className="text-sm font-bold text-teal-700 hover:text-teal-900 no-underline"
        >
          ← Back to dashboard
        </Link>
      }
    >
      <ErrorBanner message={error} />

      {verification && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-slate-100 border border-slate-200 p-4 text-sm">
          <span className="font-bold text-slate-800">Verification status:</span>
          <span className="uppercase font-bold tracking-wider text-teal-700">
            {verification.verification_status}
          </span>
          {verification.admin_message && (
            <span className="text-slate-500">{verification.admin_message}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={submitProfile}
          className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Practice Details</h2>
            <p className="text-sm text-slate-500">Shown to patients on your published guidance.</p>
          </div>

          <SuccessBanner message={profileMsg} />

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              value={profileForm.full_name}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, full_name: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="specialization">Specialization</label>
            <input
              id="specialization"
              value={profileForm.specialization}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, specialization: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="workplace">Workplace</label>
            <input
              id="workplace"
              value={profileForm.workplace}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, workplace: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="public_phone">Public Phone</label>
            <input
              id="public_phone"
              value={profileForm.public_phone}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, public_phone: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="social_media_url">Social Media URL</label>
            <input
              id="social_media_url"
              value={profileForm.social_media_url}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, social_media_url: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all cursor-pointer disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Practice Details"}
          </button>
        </form>

        <form
          onSubmit={submitCredentials}
          className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Credentials & Licensing</h2>
            <p className="text-sm text-slate-500">Verified by the admin team.</p>
          </div>

          <SuccessBanner message={credMsg} />

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="degree">Degree</label>
            <input
              id="degree"
              value={credForm.degree}
              onChange={(e) => setCredForm((c) => ({ ...c, degree: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="graduation_year">Graduation Year</label>
            <input
              id="graduation_year"
              type="number"
              value={credForm.graduation_year}
              onChange={(e) =>
                setCredForm((c) => ({ ...c, graduation_year: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="college_name">College / University</label>
            <input
              id="college_name"
              value={credForm.college_name}
              onChange={(e) =>
                setCredForm((c) => ({ ...c, college_name: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="registration_number">
              Registration Number
            </label>
            <input
              id="registration_number"
              value={credForm.professional_registration_number}
              onChange={(e) =>
                setCredForm((c) => ({
                  ...c,
                  professional_registration_number: e.target.value,
                }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="cred_authority">
              Registration Authority
            </label>
            <input
              id="cred_authority"
              value={credForm.registration_authority}
              onChange={(e) =>
                setCredForm((c) => ({ ...c, registration_authority: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="doc_url">Document URL</label>
            <input
              id="doc_url"
              value={credForm.registration_document_url}
              onChange={(e) =>
                setCredForm((c) => ({ ...c, registration_document_url: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={savingCred}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            {savingCred ? "Saving..." : "Save Credentials"}
          </button>
        </form>
      </div>

      {profile?.email && (
        <p className="mt-6 text-sm text-slate-400">
          Account email: <span className="font-semibold text-slate-600">{profile.email}</span>
        </p>
      )}
    </PageShell>
  );
}
