import { useNavigate } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import { clearAccessToken } from '../../../utils/auth';

import styles from '../../misc/pages/PlaceholderPage.module.css';
import { useProfile } from '../../../context/ProfileContext';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { Button } from '@radix-ui/themes';

/**
 * Placeholder landing page for signed in users.
 *
 * It exists so the private half of the route tree has somewhere to go; the real
 * dashboard replaces it once documents and tenants are built.
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const qc = useQueryClient();
  /** Drops the token and returns the user to the login screen. */
  const handleLogout = () => {
    clearAccessToken();
    qc.setQueryData([QueryKey.PROFILE_CONTEXT], () => {
      return null;
    });
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };
  console.log(profile);
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Dashboard</p>
      <h1 className={styles.title}>
        {profile ? `Hello, ${profile.email}` : 'Hello'}
      </h1>
      <p className={styles.description}>
        Documents, tenants and plans will live here. For now this page just
        proves the private route guard works.
      </p>

      <Button onClick={handleLogout}>Log out</Button>
    </section>
  );
};
