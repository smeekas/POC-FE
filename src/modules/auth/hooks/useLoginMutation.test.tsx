import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import {
  createProviderWrapper,
  createTestQueryClient,
} from '../../../test/renderWithProviders';
import { useLoginMutation } from './useLoginMutation';

const navigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');

  return { ...actual, useNavigate: () => navigate };
});

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../api/axiosInstance', () => ({
  axiosInstance: { post: vi.fn() },
}));

const post = vi.mocked(axiosInstance.post);
const CREDENTIALS = { email: 'user@company.com', password: 'secret123' };

/** Wraps a login payload in the envelope the backend sends back. */
const loginResponse = (
  body: Partial<{
    status: number;
    statusMessage: string;
    data: { access_token: string; redirect?: string } | null;
  }>,
) => ({
  data: {
    status: 200,
    statusMessage: 'Logged in successfully.',
    data: { access_token: 'token-123' },
    ...body,
  },
});

/** Renders the hook inside the app's provider tree. */
const renderLoginMutation = (queryClient = createTestQueryClient()) => {
  const utils = renderHook(() => useLoginMutation(), {
    wrapper: createProviderWrapper({ queryClient }),
  });

  return { ...utils, queryClient };
};

describe('useLoginMutation', () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it('posts the credentials to the login endpoint', async () => {
    post.mockResolvedValue(loginResponse({}));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, CREDENTIALS);
  });

  it('unwraps the axios envelope and returns the API response body', async () => {
    post.mockResolvedValue(loginResponse({}));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      status: 200,
      statusMessage: 'Logged in successfully.',
      data: { access_token: 'token-123' },
    });
  });

  it('toasts the success message on a 200', async () => {
    post.mockResolvedValue(loginResponse({ statusMessage: 'Welcome back.' }));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Welcome back.'));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('invalidates the profile context so the user is re-fetched', async () => {
    post.mockResolvedValue(loginResponse({}));

    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderLoginMutation(queryClient);

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(invalidateQueries).toHaveBeenCalled());

    const predicate = invalidateQueries.mock.calls[0]?.[0]?.predicate;

    expect(predicate).toBeTypeOf('function');
    expect(
      predicate?.({ queryKey: [QueryKey.PROFILE_CONTEXT] } as never),
    ).toBe(true);
    expect(predicate?.({ queryKey: [QueryKey.DOCUMENTS] } as never)).toBe(false);
  });

  it('sends the user to documents when the backend asks for no redirect', async () => {
    post.mockResolvedValue(loginResponse({}));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(ROUTE_PATHS.DOCUMENTS, { replace: true }),
    );
  });

  it('follows the redirect the backend returns', async () => {
    post.mockResolvedValue(
      loginResponse({ data: { access_token: 'token-123', redirect: '/onboarding' } }),
    );

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/onboarding', { replace: true }),
    );
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('falls back to documents when the response carries no data at all', async () => {
    post.mockResolvedValue(loginResponse({ data: null }));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(ROUTE_PATHS.DOCUMENTS, { replace: true }),
    );
  });

  /**
   * Known gap: `getApiErrorMessage` only reads `statusMessage` off an `AxiosError`, so a
   * non 200 delivered in a resolved body falls through to the generic message. Flip this
   * expectation to `'Invalid credentials.'` once the envelope branch in `utils/error.ts`
   * is fixed.
   */
  it('toasts an error and stays put when the body reports a non 200 status', async () => {
    post.mockResolvedValue(
      loginResponse({ status: 401, statusMessage: 'Invalid credentials.', data: null }),
    );

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong. Please try again.',
      ),
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('surfaces the backend message when the request rejects', async () => {
    post.mockRejectedValue(
      new AxiosError('Request failed', '401', undefined, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 401, statusMessage: 'Email or password is incorrect.' },
      }),
    );

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Email or password is incorrect.');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('falls back to a generic message when the failure carries none', async () => {
    post.mockRejectedValue(new Error(''));

    const { result } = renderLoginMutation();

    result.current.mutate(CREDENTIALS);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong. Please try again.',
    );
  });
});
