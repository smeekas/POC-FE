import { useNavigate } from 'react-router';

import { Button } from '../../../components/ui/Button';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { clearAccessToken } from '../../../utils/auth';
import { useProfileContextQuery } from '../../auth/hooks/useProfileContextQuery';

import styles from '../../misc/pages/PlaceholderPage.module.css';

/**
 * Placeholder landing page for signed in users.
 *
 * It exists so the private half of the route tree has somewhere to go; the real
 * dashboard replaces it once documents and tenants are built.
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: profileContext } = useProfileContextQuery();

  /** Drops the token and returns the user to the login screen. */
  const handleLogout = () => {
    clearAccessToken();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Dashboard</p>
      <h1 className={styles.title}>
        {profileContext ? `Hello, ${profileContext.data.email}` : 'Hello'}
      </h1>
      <p className={styles.description}>
        Documents, tenants and plans will live here. For now this page just proves
        the private route guard works.
      </p>

      <Button variant="secondary" onClick={handleLogout}>
        Log out
      </Button>
    </section>
  );
};
