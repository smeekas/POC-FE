import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import {
  MINIMUM_PASSWORD_LENGTH,
  SIGNUP_FORM_DEFAULT_VALUES,
  signupFormSchema,
  type SignupFormValues,
} from '../../../schema/signup';
import { getApiErrorMessage } from '../../../utils/error';
import { useSignupMutation } from '../hooks/useSignupMutation';
import { AuthFormHeader } from '../components/AuthFormHeader';

import styles from './AuthPage.module.css';

/**
 * Registration screen.
 *
 * Signup creates the account but hands back no token, so a successful submit sends the
 * user to login rather than into the signed-in half of the app.
 */
export const SignupPage = () => {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: SIGNUP_FORM_DEFAULT_VALUES,
  });

  /** Registers the user and, on success, sends them to the login screen. */
  const onSubmit = handleSubmit((values) => {
    signupMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          navigate(ROUTE_PATHS.LOGIN, { replace: true });
        },
      },
    );
  });

  return (
    <section className={styles.page}>
      <AuthFormHeader
        title='Create your account'
        subtitle='Start a workspace, or join one you have been invited to.'
      />

      {signupMutation.isError ? (
        <Alert color='red' role='alert'>
          {getApiErrorMessage(signupMutation.error)}
        </Alert>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              id='signup-email'
              label='Work email'
              type='email'
              placeholder='you@company.com'
              autoComplete='email'
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              id='signup-password'
              label='Password'
              placeholder='Create a password'
              autoComplete='new-password'
              description={`At least ${MINIMUM_PASSWORD_LENGTH} characters, with a letter and a number.`}
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='confirmPassword'
          control={control}
          render={({ field, fieldState }) => (
            <PasswordInput
              id='signup-confirm-password'
              label='Confirm password'
              placeholder='Repeat your password'
              autoComplete='new-password'
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Button type='submit' loading={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className={styles.switch}>
        Already have an account? <Link to={ROUTE_PATHS.LOGIN}>Sign in</Link>
      </p>
    </section>
  );
};
