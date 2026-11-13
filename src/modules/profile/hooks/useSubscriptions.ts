import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { SubscriptionResponse } from '../dto/subscription.dto';

export function useSubscriptions() {
  return useQuery({
    queryKey: [QueryKey.subscription],
    queryFn: () =>
      axiosInstance.get<SubscriptionResponse>(API_ENDPOINTS.subscriptions),
  });
}
