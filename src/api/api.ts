// ✅ src/api.ts
import axios from "axios";

// Use Node backend (signup/login)
const api = axios.create({
  baseURL: "http://localhost:5001/api", 
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 JWT token attachment (if used)
api.interceptors.request.use(
  (config) => {
    const doctorToken = localStorage.getItem("doctorToken");
    const patientToken = localStorage.getItem("patientToken");

    if (doctorToken) {
      config.headers.Authorization = `Bearer ${doctorToken}`;
    } else if (patientToken) {
      config.headers.Authorization = `Bearer ${patientToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized — redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;
