import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 🔹 Retrieve stored token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 🔹 Attach token
  }
  return config;
});
