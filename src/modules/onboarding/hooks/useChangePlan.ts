import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import { getApiErrorMessage } from '../../../utils/error';

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
      axiosInstance.post<APIResponse<{ name: string }>>(
        API_ENDPOINTS.CHANGE_PLAN,
        reqBody,
      ),
    onSuccess: async (response) => {
      if (response.status === 201) {
        toast.success(`Plan changed to ${response.data.data?.name}`);
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.PROFILE_CONTEXT],
        });
      } else {
        toast.error(getApiErrorMessage(response.data));
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};

export default useChangePlan;
