import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">
          Verifying session credentials...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    let targetLogin = "/user/login";
    if (allowedRoles?.includes("doctor")) targetLogin = "/doctor/login";
    if (allowedRoles?.includes("admin")) targetLogin = "/admin/login";

    return <Navigate to={targetLogin} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
