import { Navigate } from 'react-router';
import { useProfile } from '../../../context/ProfileContext';
import { ROUTE_PATHS } from '../../../constants/routePaths';

/**
 * Placeholder landing page for signed in users.
 *
 * It exists so the private half of the route tree has somewhere to go; the real
 * dashboard replaces it once documents and tenants are built.
 */
export const DashboardPage = () => {
  const { profile } = useProfile();
  if (!profile) return <Navigate to={ROUTE_PATHS.LOGIN} />;
  if ('require_onboarding' in profile) {
    if (profile.require_onboarding) {
      return <Navigate to={ROUTE_PATHS.ONBOARDING} />;
    }
  }
  if ('isPlatformAdmin' in profile) {
    return <Navigate to={ROUTE_PATHS.PLATFORM_ADMIN_DASHBOARD} />;
  } else if ('role' in profile) {
    return <Navigate to={ROUTE_PATHS.DOCUMENTS} />;
  }
};
