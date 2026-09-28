import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { FormField } from '../../../components/form/FormField';
import { PasswordInput } from '../../../components/form/PasswordInput';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
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
  const navigate = useNavigate();
  const { mutate, isError, error, isPending } = useLoginMutation();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  });

  /** Sends the credentials and, on success, hands the user over to the dashboard. */
  const onSubmit = handleSubmit((values) => {
    mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
        },
      },
    );
  });

  return (
    <section className={styles.page}>
      <AuthFormHeader
        title='Welcome back'
        subtitle='Sign in to get back to your workspace.'
      />

      {isError ? (
        <Alert severity='error'>{getApiErrorMessage(error)}</Alert>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId='login-email'
              label='Email'
              error={fieldState.error?.message}
            >
              <TextInput
                id='login-email'
                type='email'
                placeholder='you@company.com'
                autoComplete='email'
                invalid={fieldState.invalid}
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId='login-password'
              label='Password'
              error={fieldState.error?.message}
            >
              <PasswordInput
                id='login-password'
                name={field.name}
                value={field.value}
                placeholder='Enter your password'
                autoComplete='current-password'
                invalid={fieldState.invalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormField>
          )}
        />

        <Button type='submit' fluid loading={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className={styles.switch}>
        New here? <Link to={ROUTE_PATHS.SIGNUP}>Create an account</Link>
      </p>
    </section>
  );
};
