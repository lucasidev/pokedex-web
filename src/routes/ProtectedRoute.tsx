import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '@/components/Loading';
import { useMe } from '@/features/auth/auth.queries';
import { useAuthStore } from '@/features/auth/auth.store';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const { isLoading, isError } = useMe();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}
