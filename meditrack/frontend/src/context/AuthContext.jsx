import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      localStorage.removeItem("token");
      setUser(null);
      setError(err.response?.data?.message || "Session expired");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password, role) => {
    try {
      setLoading(true);
      const payload = { email, password };
      if (role) payload.role = role;
      const response = await api.post("/auth/login", payload);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register/user", userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const registerDoctor = async (doctorData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register/doctor", doctorData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        registerUser,
        registerDoctor,
        logout,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
