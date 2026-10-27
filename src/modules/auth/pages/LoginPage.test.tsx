import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { LoginPage } from './LoginPage';

const mutate = vi.fn();
const loginMutation = {
  mutate,
  isError: false,
  error: null as unknown,
  isPending: false,
};

vi.mock('../hooks/useLoginMutation', () => ({
  useLoginMutation: () => loginMutation,
}));

/** Puts the mutation hook back into its idle state between tests. */
const resetMutationState = () => {
  loginMutation.isError = false;
  loginMutation.error = null;
  loginMutation.isPending = false;
  mutate.mockReset();
};

const fields = () => ({
  email: screen.getByLabelText('Email'),
  password: screen.getByLabelText('Password'),
  submit: screen.getByRole('button', { name: /sign in/i }),
});

describe('LoginPage', () => {
  beforeEach(resetMutationState);

  it('renders the email and password fields with a submit button', () => {
    renderWithProviders(<LoginPage />);

    const { email, password, submit } = fields();

    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('autocomplete', 'email');
    expect(password).toHaveAttribute('autocomplete', 'current-password');
    expect(submit).toBeEnabled();
  });

  it('links to the signup page for new users', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute(
      'href',
      ROUTE_PATHS.SIGNUP,
    );
  });

  it('submits the typed credentials', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    const { email, password, submit } = fields();

    await user.type(email, 'user@company.com');
    await user.type(password, 'secret123');
    await user.click(submit);

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        email: 'user@company.com',
        password: 'secret123',
      }),
    );
  });

  it('blocks submission and shows field errors when the form is empty', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    await user.click(fields().submit);

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('blocks submission when the email is malformed', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    const { email, password, submit } = fields();

    await user.type(email, 'not-an-email');
    await user.type(password, 'secret123');
    await user.click(submit);

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows the server error in an alert when login fails', () => {
    loginMutation.isError = true;
    loginMutation.error = new AxiosError(
      'Request failed',
      '401',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 401, statusMessage: 'Email or password is incorrect.' },
      },
    );

    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Email or password is incorrect.',
    );
  });

  it('shows no alert while the form is untouched', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('switches the button to a pending label while the request is in flight', () => {
    loginMutation.isPending = true;

    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^sign in$/i })).not.toBeInTheDocument();
  });
});
