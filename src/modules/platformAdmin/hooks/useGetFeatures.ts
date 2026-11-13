import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { FeatureResponse } from '../dto/feature.dto';

export function useGetFeatures() {
  return useQuery({
    queryKey: [QueryKey.Features],
    queryFn: () =>
      axiosInstance.get<FeatureResponse>(
        API_ENDPOINTS.PlatformAdmin.getFeatures(),
      ),
  });
}
