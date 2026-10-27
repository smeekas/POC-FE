import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import { MINIMUM_PASSWORD_LENGTH } from '../../../schema/signup';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { SignupPage } from './SignupPage';

const navigate = vi.fn();
const mutate = vi.fn();
const signupMutation = {
  mutate,
  isError: false,
  error: null as unknown,
  isPending: false,
};

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');

  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../hooks/useSignupMutation', () => ({
  useSignupMutation: () => signupMutation,
}));

/** Puts the mutation hook back into its idle state between tests. */
const resetMutationState = () => {
  signupMutation.isError = false;
  signupMutation.error = null;
  signupMutation.isPending = false;
  mutate.mockReset();
  navigate.mockReset();
};

const fields = () => ({
  email: screen.getByLabelText('Work email'),
  password: screen.getByLabelText('Password'),
  confirmPassword: screen.getByLabelText('Confirm password'),
  submit: screen.getByRole('button', { name: /create account/i }),
});

/** Fills the whole form with values that pass validation unless overridden. */
const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<Record<'email' | 'password' | 'confirmPassword', string>> = {},
) => {
  const values = {
    email: 'user@company.com',
    password: 'passw0rd',
    confirmPassword: 'passw0rd',
    ...overrides,
  };
  const { email, password, confirmPassword } = fields();

  if (values.email) await user.type(email, values.email);
  if (values.password) await user.type(password, values.password);
  if (values.confirmPassword) await user.type(confirmPassword, values.confirmPassword);
};

describe('SignupPage', () => {
  beforeEach(resetMutationState);

  it('renders all three fields with new-password autofill hints', () => {
    renderWithProviders(<SignupPage />);

    const { email, password, confirmPassword } = fields();

    expect(email).toHaveAttribute('type', 'email');
    expect(password).toHaveAttribute('autocomplete', 'new-password');
    expect(confirmPassword).toHaveAttribute('autocomplete', 'new-password');
  });

  it('spells out the password rule next to the field', () => {
    renderWithProviders(<SignupPage />);

    expect(
      screen.getByText(
        `At least ${MINIMUM_PASSWORD_LENGTH} characters, with a letter and a number.`,
      ),
    ).toBeInTheDocument();
  });

  it('links back to login for returning users', () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      ROUTE_PATHS.LOGIN,
    );
  });

  it('submits only the email and password, dropping the confirmation', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await fillForm(user);
    await user.click(fields().submit);

    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1));
    expect(mutate.mock.calls[0]?.[0]).toEqual({
      email: 'user@company.com',
      password: 'passw0rd',
    });
  });

  it('sends the user to login once the account is created', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await fillForm(user);
    await user.click(fields().submit);

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    mutate.mock.calls[0]?.[1]?.onSuccess?.();

    expect(navigate).toHaveBeenCalledWith(ROUTE_PATHS.LOGIN, { replace: true });
  });

  it('does not navigate while the mutation is still unresolved', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await fillForm(user);
    await user.click(fields().submit);

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(navigate).not.toHaveBeenCalled();
  });

  it('blocks submission and shows every error when the form is empty', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await user.click(fields().submit);

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('blocks submission when the confirmation does not match', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await fillForm(user, { confirmPassword: 'passw0rdX' });
    await user.click(fields().submit);

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('blocks submission when the password has no number', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupPage />);
    await fillForm(user, { password: 'password', confirmPassword: 'password' });
    await user.click(fields().submit);

    expect(
      await screen.findByText('Password must contain at least one number.'),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows the server error in an alert when signup fails', () => {
    signupMutation.isError = true;
    signupMutation.error = new AxiosError(
      'Request failed',
      '409',
      undefined,
      undefined,
      {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 409, statusMessage: 'Email already registered.' },
      },
    );

    renderWithProviders(<SignupPage />);

    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered.');
  });

  it('switches the button to a pending label while the request is in flight', () => {
    signupMutation.isPending = true;

    renderWithProviders(<SignupPage />);

    expect(
      screen.getByRole('button', { name: /creating account/i }),
    ).toBeInTheDocument();
  });
});
