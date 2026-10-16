import { type ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Navigate } from 'react-router';
import { ROUTE_PATHS } from '../constants/routePaths';

type PlatformAdminGuardProps = {
  children: ReactNode;
};
function PlatformAdminGuard({ children }: PlatformAdminGuardProps) {
  const { profile } = useProfile();
  const hasAccess =
    profile && 'isPlatformAdmin' in profile ? profile.isPlatformAdmin : false;
  if (hasAccess) return children;
  return <Navigate to={ROUTE_PATHS.ROOT} />;
}

export default PlatformAdminGuard;
