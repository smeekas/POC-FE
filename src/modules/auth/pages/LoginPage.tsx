import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import {
  LOGIN_FORM_DEFAULT_VALUES,
  loginFormSchema,
  type LoginFormValues,
} from '../../../schema/login';
import { getApiErrorMessage } from '../../../utils/error';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { AuthFormHeader } from '../components/AuthFormHeader';

import styles from './AuthPage.module.css';

/** Sign in screen: email and password, then straight to the dashboard. */
export const LoginPage = () => {
  const { mutate, isError, error, isPending } = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  });

  /** Sends the credentials and, on success, hands the user over to the dashboard. */
  const onSubmit = handleSubmit((values) => {
    mutate({ email: values.email, password: values.password });
  });

  return (
    <section className={styles.page}>
      <AuthFormHeader
        title='Welcome back'
        subtitle='Sign in to get back to your workspace.'
      />

      {isError ? (
        <Alert color='red' role='alert'>
          {getApiErrorMessage(error)}
        </Alert>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              id='login-email'
              label='Email'
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
              id='login-password'
              label='Password'
              placeholder='Enter your password'
              autoComplete='current-password'
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Button type='submit' loading={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className={styles.switch}>
        New here? <Link to={ROUTE_PATHS.SIGNUP}>Create an account</Link>
      </p>
    </section>
  );
};
