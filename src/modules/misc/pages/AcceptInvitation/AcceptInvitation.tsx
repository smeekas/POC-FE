import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@radix-ui/themes';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router';

import { ConfirmDialog } from '../../../../components/common/ConfirmDialog/ConfirmDialog';
import { AuthFormHeader } from '../../../auth/components/AuthFormHeader';
import { FormField } from '../../../../components/form/FormField';
import { PasswordInput } from '../../../../components/form/PasswordInput';
import { Alert } from '../../../../components/ui/Alert';
import { ROUTE_PATHS } from '../../../../constants/routePaths';
import {
  ACCEPT_INVITATION_FORM_DEFAULT_VALUES,
  acceptInvitationFormSchema,
  type AcceptInvitationFormValues,
} from '../../../../schema/acceptInvitation';
import { MINIMUM_PASSWORD_LENGTH } from '../../../../schema/signup';
import { getApiErrorMessage } from '../../../../utils/error';
import { useAcceptInvitation } from '../../hooks/useAcceptInvitation';

import styles from './AcceptInvitation.module.css';
import toast from 'react-hot-toast';

/**
 * Where an invite link lands: the invitee picks a password and the invite becomes an
 * account.
 *
 * The token in the query string is the whole authorisation, so without one there is
 * nothing to accept and the page sends the visitor to login instead.
 */
function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || null;
  const { mutate, isPending, isError, error } = useAcceptInvitation();
  const [confirming, setConfirming] = useState(false);

  const { control, handleSubmit, getValues } =
    useForm<AcceptInvitationFormValues>({
      resolver: zodResolver(acceptInvitationFormSchema),
      defaultValues: ACCEPT_INVITATION_FORM_DEFAULT_VALUES,
    });

  /* Only a valid password opens the dialog, so the question is never asked about input
     that could not be submitted anyway. */
  const onSubmit = handleSubmit(() => setConfirming(true));

  /** Sets the password against the token and, on success, sends the user to login. */
  const handleConfirm = () => {
    if (!token) return;

    mutate(
      { token, password: getValues('password') },
      {
        onSuccess: (data) => {
          if (data.status === 201) {
            setConfirming(false);
            toast.success(data.data.statusMessage);
            navigate(ROUTE_PATHS.LOGIN, { replace: true });
          } else {
            setConfirming(false);
          }
        },
        onError() {
          setConfirming(false);
        },
        /* The dialog stays open on failure: the error belongs next to the retry. */
      },
    );
  };

  if (!token) return <Navigate to={ROUTE_PATHS.LOGIN} replace />;

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <AuthFormHeader
          title='Accept your invitation'
          subtitle='Pick a password and the workspace is yours to walk into.'
        />

        {isError ? (
          <Alert severity='error'>{getApiErrorMessage(error)}</Alert>
        ) : null}

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId='accept-password'
                label='Password'
                error={fieldState.error?.message}
                hint={`At least ${MINIMUM_PASSWORD_LENGTH} characters, with a letter and a number.`}
              >
                <PasswordInput
                  id='accept-password'
                  name={field.name}
                  value={field.value}
                  placeholder='Create a password'
                  autoComplete='new-password'
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <FormField
                inputId='accept-confirm-password'
                label='Confirm password'
                error={fieldState.error?.message}
              >
                <PasswordInput
                  id='accept-confirm-password'
                  name={field.name}
                  value={field.value}
                  placeholder='Repeat your password'
                  autoComplete='new-password'
                  invalid={fieldState.invalid}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormField>
            )}
          />

          <Button type='submit' disabled={isPending}>
            Accept invitation
          </Button>
        </form>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title='Accept this invitation?'
        description='Your password will be set and you will join the workspace.'
        loading={isPending}
        onConfirm={handleConfirm}
      />
    </section>
  );
}

export default AcceptInvitation;
