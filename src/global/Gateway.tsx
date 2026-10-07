import { Navigate } from 'react-router';
import { useProfile } from '../context/ProfileContext';
import type { ReactNode } from 'react';
import { ROUTE_PATHS } from '../constants/routePaths';

type GatewayProps = { children: ReactNode };
function Gateway({ children }: GatewayProps) {
  const { profile } = useProfile();
  if (profile?.require_onboarding)
    return <Navigate to={ROUTE_PATHS.ONBOARDING} />;
  return children;
}

export default Gateway;
