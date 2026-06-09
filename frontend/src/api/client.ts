import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  const { cashDeskId } = useAuthStore.getState();
  if (cashDeskId != null) {
    config.headers["X-Cash-Desk"] = String(cashDeskId);
  }
  return config;
});

export default api;
