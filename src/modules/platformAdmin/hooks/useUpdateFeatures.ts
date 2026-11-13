import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type {
  TenantFeatureResponse,
  TenantFeatureUpdateRequest,
} from '../dto/feature.dto';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../../utils/error';
import { QueryKey } from '../../../constants/queryKey';

export function useUpdateFeatures(tenantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: TenantFeatureUpdateRequest) => {
      return axiosInstance.patch<TenantFeatureResponse>(
        API_ENDPOINTS.PlatformAdmin.tenantFeatures(tenantId),
        req,
      );
    },
    onSuccess(data) {
      if (data.status === 200) {
        toast.success(data.data.statusMessage);
        qc.invalidateQueries({ queryKey: [QueryKey.TenantFeatures, tenantId] });
      } else {
        toast.error(getApiErrorMessage(data.data));
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
