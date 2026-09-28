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
        name: values.name,
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
        title="Create your account"
        subtitle="Start a workspace, or join one you have been invited to."
      />

      {signupMutation.isError ? (
        <Alert severity="error">
          {getApiErrorMessage(signupMutation.error)}
        </Alert>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId="signup-name"
              label="Full name"
              error={fieldState.error?.message}
            >
              <TextInput
                id="signup-name"
                placeholder="Ada Lovelace"
                autoComplete="name"
                invalid={fieldState.invalid}
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId="signup-email"
              label="Work email"
              error={fieldState.error?.message}
            >
              <TextInput
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                invalid={fieldState.invalid}
                {...field}
              />
            </FormField>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId="signup-password"
              label="Password"
              error={fieldState.error?.message}
              hint={`At least ${MINIMUM_PASSWORD_LENGTH} characters, with a letter and a number.`}
            >
              <PasswordInput
                id="signup-password"
                name={field.name}
                value={field.value}
                placeholder="Create a password"
                autoComplete="new-password"
                invalid={fieldState.invalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormField>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              inputId="signup-confirm-password"
              label="Confirm password"
              error={fieldState.error?.message}
            >
              <PasswordInput
                id="signup-confirm-password"
                name={field.name}
                value={field.value}
                placeholder="Repeat your password"
                autoComplete="new-password"
                invalid={fieldState.invalid}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormField>
          )}
        />

        <Button type="submit" fluid loading={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className={styles.switch}>
        Already have an account? <Link to={ROUTE_PATHS.LOGIN}>Sign in</Link>
      </p>
    </section>
  );
};
