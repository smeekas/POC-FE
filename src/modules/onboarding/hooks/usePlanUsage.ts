import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import type { APIResponse } from '../../../types/common.types';
import type { PlanUsageDto } from '../onboarding.dto';
import { API_ENDPOINTS } from '../../../constants/endpoints';

export function usePlanUsage() {
  return useQuery({
    queryKey: [QueryKey.PLAN_USAGE],
    queryFn: () =>
      axiosInstance.get<APIResponse<PlanUsageDto>>(API_ENDPOINTS.PLAN_USAGE),
  });
}
