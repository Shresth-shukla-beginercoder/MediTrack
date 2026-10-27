import { Link } from "react-router-dom";

const platformLinks = [
  { label: "Overview", path: "/" },
  { label: "Medical Library", path: "/instructions" },
  { label: "Dosage Protocol", path: "/instructions" },
];

const patientLinks = [
  { label: "Patient Sign In", path: "/user/login" },
  { label: "Create Account", path: "/user/register" },
  { label: "Schedules & Reminders", path: "/user/dashboard" },
];

const clinicalLinks = [
  { label: "Doctor Portal", path: "/doctor/login" },
  { label: "Physician Onboarding", path: "/doctor/register" },
  { label: "Admin Console", path: "/admin/login" },
];

function FooterLinks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
      <div className="flex flex-col gap-3">
        <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Platform</h4>
        <div className="flex flex-col space-y-2">
          {platformLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-slate-400 hover:text-teal-400 transition-colors duration-200 text-xs sm:text-sm no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Patients</h4>
        <div className="flex flex-col space-y-2">
          {patientLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-slate-400 hover:text-teal-400 transition-colors duration-200 text-xs sm:text-sm no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Clinicians</h4>
        <div className="flex flex-col space-y-2">
          {clinicalLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-slate-400 hover:text-teal-400 transition-colors duration-200 text-xs sm:text-sm no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FooterLinks;
