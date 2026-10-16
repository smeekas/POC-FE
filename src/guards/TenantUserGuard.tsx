import { type ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Navigate } from 'react-router';
import { ROUTE_PATHS } from '../constants/routePaths';

type TenantUserGuardProps = {
  children: ReactNode;
};
function TenantUserGuard({ children }: TenantUserGuardProps) {
  const { profile } = useProfile();
  const hasAccess = profile && 'require_onboarding' in profile;

  if (hasAccess) {
    return children;
  }
  return <Navigate to={ROUTE_PATHS.ROOT} />;
}

export default TenantUserGuard;
