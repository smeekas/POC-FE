import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../../constants/queryKey';
import { hasAccessToken, setAccessToken } from '../../utils/auth';
import { fetchProfileContext, loginRequest, signupRequest } from './auth.api';
import type { AuthResponseDto } from './auth.dto';

/**
 * TanStack Query bindings for the auth module.
 *
 * Every hook here owns one server interaction and the cache side effects that go with it.
 */

/**
 * Loads the logged in user and their tenant context.
 *
 * Skipped entirely when no token is stored, so anonymous visitors never fire a
 * request that is guaranteed to 401.
 */
export const useProfileContextQuery = () => {
  return useQuery({
    queryKey: [QueryKey.PROFILE_CONTEXT],
    queryFn: fetchProfileContext,
    enabled: hasAccessToken(),
    retry: false,
  });
};

/** Stores the returned token and seeds the profile cache after a successful auth call. */
const useAuthSuccessHandler = () => {
  const queryClient = useQueryClient();

  return (response: AuthResponseDto) => {
    setAccessToken(response.accessToken);
    queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE_CONTEXT] });
  };
};

/** Logs an existing user in. */
export const useLoginMutation = () => {
  const handleAuthSuccess = useAuthSuccessHandler();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: handleAuthSuccess,
  });
};

/** Registers a new user and logs them straight in. */
export const useSignupMutation = () => {
  const handleAuthSuccess = useAuthSuccessHandler();

  return useMutation({
    mutationFn: signupRequest,
    onSuccess: handleAuthSuccess,
  });
};
