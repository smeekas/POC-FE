import { Navigate } from 'react-router';

import type { ReactNode } from 'react';
import { ROUTE_PATHS } from '../constants/routePaths';
import { useTenantUser } from '../hooks/useTenantUser';

type GatewayProps = { children: ReactNode };
function Gateway({ children }: GatewayProps) {
  const { profile } = useTenantUser();
  if (profile?.require_onboarding)
    return <Navigate to={ROUTE_PATHS.ONBOARDING} />;
  return children;
}

export default Gateway;
