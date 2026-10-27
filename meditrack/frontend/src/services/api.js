import axios from "axios";

// API base URL: set VITE_API_URL in .env (or the Docker build arg) to change it.
// Falls back to the local backend on 5001 with the /api/v1 prefix.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
