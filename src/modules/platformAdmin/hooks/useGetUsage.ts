import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { TenantUsageResponse } from '../dto/usage.dto';

export function useGetUsage() {
  return useQuery({
    queryKey: [QueryKey.TenantUsage],
    queryFn: () =>
      axiosInstance.get<TenantUsageResponse>(API_ENDPOINTS.PlatformAdmin.usage),
  });
}
