import { Navigate, Outlet } from "react-router-dom";
import { useServerUrl } from "../store/useServerStore";

export default function ServerGuard() {
  const serverUrl = useServerUrl();
  const isElectron = !!window.electronAPI;

  if (isElectron && !serverUrl) {
    return <Navigate to="/server-setup" replace />;
  }

  return <Outlet />;
}
