import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import type { PlansResponseDto } from '../onboarding.dto';

/** Fetches the subscription plans shown on the upgrade screen. */
export const usePlansQuery = () => {
  return useQuery({
    queryKey: [QueryKey.PLANS],
    queryFn: () =>
      axiosInstance.get<APIResponse<PlansResponseDto>>(API_ENDPOINTS.PLANS),
  });
};
