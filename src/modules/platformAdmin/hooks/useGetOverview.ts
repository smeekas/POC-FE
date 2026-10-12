import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { TenantOverviewResponse } from '../dto/overview.dto';

export function useGetOverview() {
  return useQuery({
    queryKey: [QueryKey.TenantOverview],
    queryFn: () =>
      axiosInstance.get<TenantOverviewResponse>(
        API_ENDPOINTS.PlatformAdmin.overview,
      ),
  });
}
