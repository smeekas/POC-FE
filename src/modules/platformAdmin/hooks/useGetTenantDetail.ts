import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { TenantDetailResponse } from '../dto/detail.dto';

function useGetTenantDetail({ id }: { id: string | undefined }) {
  return useQuery({
    queryKey: [QueryKey.TenantDetail, id],
    enabled: !!id,
    queryFn: () =>
      axiosInstance.get<TenantDetailResponse>(
        API_ENDPOINTS.PlatformAdmin.tenantDetail(id || ''),
      ),
  });
}

export default useGetTenantDetail;
