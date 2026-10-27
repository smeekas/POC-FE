import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import toast from 'react-hot-toast';
import { describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { createProviderWrapper } from '../../../test/renderWithProviders';
import { useSignupMutation } from './useSignupMutation';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../api/axiosInstance', () => ({
  axiosInstance: { post: vi.fn() },
}));

const post = vi.mocked(axiosInstance.post);
const CREDENTIALS = { email: 'user@company.com', password: 'passw0rd' };

/** Wraps a signup payload in the envelope the backend sends back. */
const signupResponse = (
  body: Partial<{ status: number; statusMessage: string }>,
) => ({
  data: {
    status: 201,
    statusMessage: 'Account created.',
    data: null,
    ...body,
  },
});

const renderSignupMutation = () =>
  renderHook(() => useSignupMutation(), { wrapper: createProviderWrapper() });

describe('useSignupMutation', () => {
  it('posts the credentials to the signup endpoint', async () => {
    post.mockResolvedValue(signupResponse({}));

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.SIGNUP, CREDENTIALS);
  });

  it('resolves with a null data field, since signup returns no token', async () => {
    post.mockResolvedValue(signupResponse({}));

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toBeNull();
  });

  it('toasts the success message on a 201', async () => {
    post.mockResolvedValue(signupResponse({ statusMessage: 'Account created.' }));

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Account created.'));
    expect(toast.error).not.toHaveBeenCalled();
  });

  /**
   * Known gap: `getApiErrorMessage` only reads `statusMessage` off an `AxiosError`, so a
   * non 201 delivered in a resolved body falls through to the generic message. Flip this
   * expectation to `'Unexpected response.'` once the envelope branch in `utils/error.ts`
   * is fixed.
   */
  it('treats any status other than 201 as a failure, including 200', async () => {
    post.mockResolvedValue(
      signupResponse({ status: 200, statusMessage: 'Unexpected response.' }),
    );

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong. Please try again.',
      ),
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('toasts the backend message when the email is already taken', async () => {
    post.mockRejectedValue(
      new AxiosError('Request failed', '409', undefined, undefined, {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 409, statusMessage: 'Email already registered.' },
      }),
    );

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Email already registered.');
  });

  it('does not retry a failed signup', async () => {
    post.mockRejectedValue(new Error('Network down'));

    const { result } = renderSignupMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(post).toHaveBeenCalledTimes(1);
  });
});
