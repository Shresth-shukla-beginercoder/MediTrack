import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AccountActions() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAuthenticated) {
    const dashboardLink =
      role === "doctor"
        ? "/doctor/dashboard"
        : role === "admin"
        ? "/admin/dashboard"
        : "/user/dashboard";

    return (
      <div className="hidden lg:flex items-center gap-3">
        <Link
          to={dashboardLink}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
            {user?.fullName?.charAt(0) || user?.full_name?.charAt(0) || "U"}
          </div>
          <span className="text-xs font-semibold text-slate-800">
            {user?.fullName || user?.full_name || "Account"}
          </span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
            {role}
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors border border-rose-200/50 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3">
      <Link
        to="/user/login"
        className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors no-underline"
      >
        Sign In
      </Link>

      <Link
        to="/user/register"
        className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 rounded-full shadow-md shadow-teal-700/20 hover:shadow-lg hover:shadow-teal-700/30 transition-all duration-200 no-underline flex items-center gap-1.5"
      >
        <span>Get Started</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      <Link
        to="/doctor/login"
        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 rounded-full transition-all duration-200 no-underline flex items-center gap-1.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-teal-600"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span>Doctor Portal</span>
      </Link>

      <Link
        to="/admin/login"
        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors no-underline"
      >
        Admin
      </Link>
    </div>
  );
}
