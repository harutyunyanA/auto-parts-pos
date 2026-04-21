import { Navigate, Outlet } from 'react-router-dom';
import { useSource } from '../store/useAuthStore';

export default function SourceGuard() {
  const source = useSource();

  if (!source) {
    return <Navigate to="/selection" replace />;
  }

  return <Outlet />;
}
