import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { TenantFeatureResponse } from '../dto/feature.dto';

export function useGetTenantFeatures(id: string | null) {
  return useQuery({
    queryKey: [QueryKey.TenantFeatures, id],
    enabled: !!id,
    queryFn: () =>
      axiosInstance.get<TenantFeatureResponse>(
        API_ENDPOINTS.PlatformAdmin.tenantFeatures(id || ''),
      ),
  });
}
