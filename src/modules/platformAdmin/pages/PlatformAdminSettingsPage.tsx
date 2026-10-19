import { Button } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { QueryKey } from '../../../constants/queryKey';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { clearAccessToken } from '../../../utils/auth';

/**
 * The platform admin's own account.
 *
 * An admin belongs to no tenant, so there is no workspace, role or plan to show the way
 * `ProfileSettingsPage` does. All that is left is the way out.
 */
export const PlatformAdminSettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /** Drops the token and returns the admin to the login screen. */
  const handleLogout = () => {
    clearAccessToken();
    queryClient.setQueryData([QueryKey.PROFILE_CONTEXT], null);
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <section>
      <PageHeader
        title='Settings'
        description='The account you are signed in to the platform console with.'
      />

      <Button color='red' variant='light' onClick={handleLogout}>
        Log out
      </Button>
    </section>
  );
};

export default PlatformAdminSettingsPage;
