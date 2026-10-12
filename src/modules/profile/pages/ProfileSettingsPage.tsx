import { Button, Flex, Heading, Separator } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { FormField } from '../../../components/form/FormField';
import { TextInput } from '../../../components/ui/TextInput';
import { QueryKey } from '../../../constants/queryKey';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { clearAccessToken } from '../../../utils/auth';
import { useTenantUser } from '../../../hooks/useTenantUser';
import PlanSelection from '../../onboarding/components/PlanSelection';

/** Stands in for a field the profile endpoint did not fill. */
const EMPTY_VALUE = '—';

/**
 * The signed in user's own account: what the workspace knows about them, and the way
 * out of it.
 *
 * The fields are read only, existing to show the shape of the account rather than to
 * collect anything. The plan is the exception, and is drawn as the same cards the
 * upgrade screen uses.
 */
export const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useTenantUser();

  /** Drops the token and returns the user to the login screen. */
  const handleLogout = () => {
    clearAccessToken();
    queryClient.setQueryData([QueryKey.PROFILE_CONTEXT], null);
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <section>
      <PageHeader
        title='Profile settings'
        description='Your account as this workspace sees it.'
      />

      <Flex direction='column' gap='3' maxWidth='420px'>
        <FormField inputId='profile-email' label='Email'>
          <TextInput
            id='profile-email'
            type='email'
            value={profile?.email ?? EMPTY_VALUE}
            readOnly
            disabled
          />
        </FormField>

        <FormField inputId='profile-role' label='Role'>
          <TextInput
            id='profile-role'
            value={profile?.role ?? EMPTY_VALUE}
            readOnly
            disabled
          />
        </FormField>

        <FormField inputId='profile-workspace' label='Workspace'>
          <TextInput
            id='profile-workspace'
            value={profile?.tenant?.name ?? EMPTY_VALUE}
            readOnly
            disabled
          />
        </FormField>

      </Flex>

      <Separator size='4' my='5' />

      {/* The plan is the one thing on this page that can actually be changed, so it is
          the cards rather than another disabled field. */}
      <Heading as='h2' size='4' mb='3'>
        Plan
      </Heading>

      <PlanSelection />

      <Separator size='4' my='5' />

      <Button color='red' variant='soft' onClick={handleLogout}>
        Log out
      </Button>
    </section>
  );
};

export default ProfileSettingsPage;
