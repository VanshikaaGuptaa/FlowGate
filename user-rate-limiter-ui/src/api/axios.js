import axios from "axios";

// When running in Docker, nginx proxies /api/* → Spring Boot backend.
// When running locally (npm run dev), VITE_API_URL falls back to localhost:8000.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;