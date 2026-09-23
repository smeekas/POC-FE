import { Navigate, Outlet, useLocation } from 'react-router';

import { FullPageLoader } from '../../components/common/FullPageLoader';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { useProfileContextQuery } from '../../modules/auth/auth.queries';
import { clearAccessToken, hasAccessToken } from '../../utils/auth';

/**
 * Gate for pages that require a signed in user.
 *
 * A missing token short circuits to login without a network call; a token that the
 * profile context endpoint rejects is thrown away before redirecting, so the user
 * does not get stuck in a loop with a stale token.
 */
export const PrivateRoute = () => {
  const location = useLocation();
  const { isLoading, isError } = useProfileContextQuery();

  if (!hasAccessToken()) {
    return (
      <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />
    );
  }

  if (isLoading) {
    return <FullPageLoader message="Checking your session…" />;
  }

  if (isError) {
    clearAccessToken();

    return (
      <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};
