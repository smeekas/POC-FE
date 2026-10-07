import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { FormField } from '../../../components/form/FormField';
import { TextInput } from '../../../components/ui/TextInput';
import {
  CREATE_WORKSPACE_FORM_DEFAULT_VALUES,
  createWorkspaceFormSchema,
  type CreateWorkspaceFormValues,
} from '../../../schema/workspace';

import styles from './Onboarding.module.css';
import { Button } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';
import { useNavigate } from 'react-router';
import { ROUTE_PATHS } from '../../../constants/routePaths';

/** Post-signup screen where a user names the tenant they are creating. */
export const OnboardingPage = () => {
  const { control, handleSubmit } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: CREATE_WORKSPACE_FORM_DEFAULT_VALUES,
  });
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: (reqBody: { name: string }) =>
      axiosInstance.post<APIResponse<null>>(API_ENDPOINTS.ONBOARDING, reqBody),
    onSuccess(data) {
      if (data.data.status === 201) {
        navigate(ROUTE_PATHS.UPGRADE);
      }
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
              <FormField
                inputId='workspace-name'
                label='Workspace name'
                error={fieldState.error?.message}
              >
                <TextInput
                  id='workspace-name'
                  placeholder='Acme Inc.'
                  autoComplete='organization'
                  disabled={isPending}
                  autoFocus
                  invalid={fieldState.invalid}
                  {...field}
                />
              </FormField>
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
