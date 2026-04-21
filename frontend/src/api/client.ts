import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const { source } = useAuthStore.getState();
  if (source) {
    config.headers["X-Source-Type"] = source;
  }
  return config;
});

export default api;
