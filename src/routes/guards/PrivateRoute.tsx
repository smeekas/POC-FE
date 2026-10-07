import { Navigate, Outlet } from 'react-router';

import { ROUTE_PATHS } from '../../constants/routePaths';
import { clearAccessToken } from '../../utils/auth';
import { useProfile } from '../../context/ProfileContext';
import type { ReactNode } from 'react';
type PrivateRouteProps = { children: ReactNode };
/**
 * Gate for pages that require a signed in user.
 *
 * A missing token short circuits to login without a network call; a token that the
 * profile context endpoint rejects is thrown away before redirecting, so the user
 * does not get stuck in a loop with a stale token.
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isError, profile } = useProfile();

  console.log({ profile }, window.location.pathname, isError);
  if (!profile) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  if (isError) {
    clearAccessToken();

    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }
  return children;
};
