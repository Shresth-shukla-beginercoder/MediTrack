import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function DesktopNavigation() {
  const { isAuthenticated, role } = useAuth();

  const getLinkClass = (isActive) =>
    `px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 no-underline ${
      isActive
        ? "bg-white text-teal-800 shadow-sm font-bold"
        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
    }`;

  return (
    <nav
      aria-label="Main navigation"
      className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-md"
    >
      <NavLink
        to="/"
        className={({ isActive }) => getLinkClass(isActive)}
      >
        Home
      </NavLink>

      <NavLink
        to="/instructions"
        className={({ isActive }) => getLinkClass(isActive)}
      >
        Medical Library
      </NavLink>

      {isAuthenticated && role === "user" && (
        <NavLink
          to="/user/dashboard"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          My Schedules
        </NavLink>
      )}

      {isAuthenticated && role === "doctor" && (
        <NavLink
          to="/doctor/dashboard"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          Doctor Portal
        </NavLink>
      )}

      {isAuthenticated && role === "admin" && (
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          Admin Console
        </NavLink>
      )}
    </nav>
  );
}
