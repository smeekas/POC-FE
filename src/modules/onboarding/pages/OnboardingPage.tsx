import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  CREATE_WORKSPACE_FORM_DEFAULT_VALUES,
  createWorkspaceFormSchema,
  type CreateWorkspaceFormValues,
} from '../../../schema/workspace';

import styles from './Onboarding.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';
import { useNavigate } from 'react-router';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import { QueryKey } from '../../../constants/queryKey';
import { getApiErrorMessage } from '../../../utils/error';

/** Post-signup screen where a user names the tenant they are creating. */
export const OnboardingPage = () => {
  const { control, handleSubmit } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: CREATE_WORKSPACE_FORM_DEFAULT_VALUES,
  });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: (reqBody: { name: string }) =>
      axiosInstance.post<APIResponse<null>>(API_ENDPOINTS.ONBOARDING, reqBody),
    async onSuccess(data) {
      if (data.data.status === 201) {
        toast.success(data.data.statusMessage);
        await qc.invalidateQueries({ queryKey: [QueryKey.PROFILE_CONTEXT] });
        navigate(ROUTE_PATHS.UPGRADE);
      } else {
        toast.error(getApiErrorMessage(data.data));
      }
    },
    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });
  /** Placeholder submit until the create-workspace endpoint exists. */
  const onSubmit = handleSubmit((values) => {
    mutate({ name: values.name });
  });

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Create your workspace</h1>
        <p className={styles.subtitle}>
          Name the space where your team will work. You can change it later.
        </p>
      </header>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <TextInput
                id='workspace-name'
                label='Workspace name'
                placeholder='Acme Inc.'
                autoComplete='organization'
                disabled={isPending}
                autoFocus
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <div className={styles.actions}>
            <Button loading={isPending} type='submit'>
              Create workspace
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
