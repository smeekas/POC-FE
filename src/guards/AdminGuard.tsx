import { type ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';
import { UserRole } from '../constants/role';
import { Navigate } from 'react-router';
import { ROUTE_PATHS } from '../constants/routePaths';

type AdminGuardProps = {
  children: ReactNode;
  navigate?: boolean;
};
function AdminGuard({ children, navigate = true }: AdminGuardProps) {
  const profile = useProfile();

  if (
    profile.profile &&
    'role' in profile.profile &&
    profile.profile?.role === UserRole.ADMIN
  )
    return children;

  if (navigate) return <Navigate to={ROUTE_PATHS.ROOT} />;
  return null;
}

export default AdminGuard;
