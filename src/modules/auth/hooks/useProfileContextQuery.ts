import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import type { ProfileRes } from '../../../types/profile.types';
import { hasAccessToken } from '../../../utils/auth';

/**
 * Fetches the logged in user and their tenant context.
 *
 * Doubles as the session check behind `PrivateRoute`: a rejected token fails the
 * query instead of returning a profile. Retries are off so an invalid session is
 * reported straight away.
 */
export const useProfileContextQuery = () => {
  return useQuery({
    queryKey: [QueryKey.PROFILE_CONTEXT],
    queryFn: async () => {
      const { data } = await axiosInstance.get<APIResponse<ProfileRes>>(
        API_ENDPOINTS.AUTH.PROFILE_CONTEXT,
      );

      return data;
    },
    enabled: hasAccessToken(),
    retry: false,
  });
};
