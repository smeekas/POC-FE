import { type ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';
import { UserRole } from '../constants/role';
import { Navigate } from 'react-router';
import { ROUTE_PATHS } from '../constants/routePaths';

type AdminGuardProps = {
  children: ReactNode;
};
function AdminGuard({ children }: AdminGuardProps) {
  const profile = useProfile();

  if (
    profile.profile &&
    'role' in profile.profile &&
    profile.profile?.role === UserRole.ADMIN
  )
    return children;
  return <Navigate to={ROUTE_PATHS.ROOT} />;
}

export default AdminGuard;
