import { Routes, Route } from "react-router-dom";

import { NavbarMed } from "./components/NavbarMed/NavbarMed.jsx";
import FooterMed from "./components/FooterMed/FooterMed.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import DoctorLogin from "./pages/DoctorLogin.jsx";
import DoctorRegister from "./pages/DoctorRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import MedicalInfoList from "./pages/MedicalInfoList.jsx";
import MedicalInfoDetail from "./pages/MedicalInfoDetail.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ScheduleForm from "./pages/ScheduleForm.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import MedicalInfoForm from "./pages/MedicalInfoForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMed />

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public medical library */}
          <Route path="/instructions" element={<MedicalInfoList />} />
          <Route path="/instructions/:id" element={<MedicalInfoDetail />} />

          {/* Protected: user */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/schedules/new"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/schedules/:id"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />

          {/* Protected: doctor */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/instructions/new"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MedicalInfoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/instructions/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MedicalInfoForm />
              </ProtectedRoute>
            }
          />

          {/* Protected: admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <FooterMed />
    </div>
  );
}

export default App;
