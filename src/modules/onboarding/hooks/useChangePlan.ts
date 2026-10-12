import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';

/**
 * Moves the tenant onto another plan.
 *
 * The profile context is refetched here rather than at the call site, because every
 * screen that can change a plan is also showing the old one somewhere.
 */
export const useChangePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reqBody: { planId: number }) =>
      axiosInstance.post<APIResponse<null>>(API_ENDPOINTS.CHANGE_PLAN, reqBody),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.PROFILE_CONTEXT],
      });
    },
  });
};

export default useChangePlan;
