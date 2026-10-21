import { Button, Divider, Stack, TextInput, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { QueryKey } from '../../../constants/queryKey';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { useTenantUser } from '../../../hooks/useTenantUser';
import PlanSelection from '../../onboarding/components/PlanSelection';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../../utils/error';

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
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post<APIResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT),
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.setQueryData([QueryKey.PROFILE_CONTEXT], null);
        navigate(ROUTE_PATHS.LOGIN, { replace: true });
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  /** Drops the token and returns the user to the login screen. */
  const handleLogout = () => {
    mutate();
  };

  return (
    <section>
      <PageHeader
        title='Profile settings'
        description='Your account as this workspace sees it.'
      />

      <Stack gap='sm' maw='420px'>
        <TextInput
          id='profile-email'
          label='Email'
          type='email'
          value={profile?.email ?? EMPTY_VALUE}
          readOnly
          disabled
        />

        <TextInput
          id='profile-role'
          label='Role'
          value={profile?.role ?? EMPTY_VALUE}
          readOnly
          disabled
        />

        <TextInput
          id='profile-workspace'
          label='Workspace'
          value={profile?.tenant?.name ?? EMPTY_VALUE}
          readOnly
          disabled
        />
      </Stack>

      <Divider my='lg' />
      {/* <AdminGuard navigate={false}> */}
      <>
        {/* The plan is the one thing on this page that can actually be changed, so it is
          the cards rather than another disabled field. */}
        <Title order={2} size='lg' mb='sm'>
          Plan
        </Title>

        <PlanSelection />

        <Divider my='lg' />
      </>
      {/* </AdminGuard */}
      <Button
        color='red'
        variant='light'
        onClick={handleLogout}
        loading={isPending}
      >
        Log out
      </Button>
    </section>
  );
};

export default ProfileSettingsPage;
