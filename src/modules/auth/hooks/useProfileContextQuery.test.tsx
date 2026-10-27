import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import {
  createProviderWrapper,
  createTestQueryClient,
} from '../../../test/renderWithProviders';
import { useProfileContextQuery } from './useProfileContextQuery';

vi.mock('../../../api/axiosInstance', () => ({
  axiosInstance: { get: vi.fn() },
}));

const get = vi.mocked(axiosInstance.get);

const PROFILE = {
  data: {
    status: 200,
    statusMessage: 'OK',
    data: { id: 1, email: 'user@company.com', role: 'ADMIN' },
  },
};

const renderProfileContextQuery = (queryClient = createTestQueryClient()) => {
  const utils = renderHook(() => useProfileContextQuery(), {
    wrapper: createProviderWrapper({ queryClient }),
  });

  return { ...utils, queryClient };
};

describe('useProfileContextQuery', () => {
  it('calls the profile context endpoint', async () => {
    get.mockResolvedValue(PROFILE);

    const { result } = renderProfileContextQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.PROFILE_CONTEXT);
  });

  it('returns the raw axios response, leaving the unwrapping to the caller', async () => {
    get.mockResolvedValue(PROFILE);

    const { result } = renderProfileContextQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data.data).toEqual({
      id: 1,
      email: 'user@company.com',
      role: 'ADMIN',
    });
  });

  it('caches under the profile context key so login can invalidate it', async () => {
    get.mockResolvedValue(PROFILE);

    const { result, queryClient } = renderProfileContextQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData([QueryKey.PROFILE_CONTEXT])).toBeDefined();
  });

  it('reports a rejected session straight away instead of retrying', async () => {
    get.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderProfileContextQuery();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('starts in a loading state before the request settles', () => {
    get.mockReturnValue(new Promise(() => {}));

    const { result } = renderProfileContextQuery();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
