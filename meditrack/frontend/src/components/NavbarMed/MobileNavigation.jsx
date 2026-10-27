import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function MobileNavigation({ open, onClose }) {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleSignOut = () => {
    logout();
    onClose();
    navigate("/");
  };

  const getMobileLinkClass = (isActive) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-base transition-all ${
      isActive
        ? "bg-teal-50/80 text-teal-800 font-bold"
        : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
    }`;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-sm">
                M
              </div>
              <span className="font-bold text-slate-900">MediTrack</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) => getMobileLinkClass(isActive)}
            >
              Home
            </NavLink>

            <NavLink
              to="/instructions"
              onClick={onClose}
              className={({ isActive }) => getMobileLinkClass(isActive)}
            >
              Medical Library
            </NavLink>

            {isAuthenticated && role === "user" && (
              <NavLink
                to="/user/dashboard"
                onClick={onClose}
                className={({ isActive }) => getMobileLinkClass(isActive)}
              >
                My Schedules
              </NavLink>
            )}

            {isAuthenticated && role === "doctor" && (
              <NavLink
                to="/doctor/dashboard"
                onClick={onClose}
                className={({ isActive }) => getMobileLinkClass(isActive)}
              >
                Doctor Dashboard
              </NavLink>
            )}

            {isAuthenticated && role === "admin" && (
              <NavLink
                to="/admin/dashboard"
                onClick={onClose}
                className={({ isActive }) => getMobileLinkClass(isActive)}
              >
                Admin Console
              </NavLink>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-bold text-slate-800">
                  {user?.fullName || user?.full_name || user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 text-center text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/user/login"
                onClick={onClose}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                User Login
              </NavLink>
              <NavLink
                to="/user/register"
                onClick={onClose}
                className="w-full py-3 text-center text-sm font-bold text-white bg-teal-600 rounded-xl shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
              >
                Create Account
              </NavLink>
              <NavLink
                to="/doctor/login"
                onClick={onClose}
                className="text-center text-xs font-semibold text-teal-700 py-1"
              >
                Doctor Portal
              </NavLink>
              <NavLink
                to="/admin/login"
                onClick={onClose}
                className="text-center text-xs text-slate-400 py-1"
              >
                Admin Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
}
