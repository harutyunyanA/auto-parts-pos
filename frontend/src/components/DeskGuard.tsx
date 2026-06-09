import { Navigate, Outlet } from 'react-router-dom';
import { useCashDeskId } from '../store/useAuthStore';

export default function DeskGuard() {
  const cashDeskId = useCashDeskId();

  if (cashDeskId == null) {
    return <Navigate to="/selection" replace />;
  }

  return <Outlet />;
}
