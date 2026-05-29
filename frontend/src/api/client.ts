import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const FALLBACK_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = window.electronAPI?.getServerUrl?.() || FALLBACK_API_URL;
  const { source } = useAuthStore.getState();
  if (source) {
    config.headers["X-Source-Type"] = source;
  }
  return config;
});

export default api;
