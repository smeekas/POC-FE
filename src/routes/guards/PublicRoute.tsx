import { Navigate, Outlet } from 'react-router';

import { ROUTE_PATHS } from '../../constants/routePaths';
import { useProfile } from '../../context/ProfileContext';

/**
 * Gate for pages that only make sense when signed out, such as login and signup.
 *
 * Holding a token is enough to bounce the visitor onward; whether that token is still
 * valid is `PrivateRoute`'s problem.
 */
export const PublicRoute = () => {
  const { profile } = useProfile();

  if (profile) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};
