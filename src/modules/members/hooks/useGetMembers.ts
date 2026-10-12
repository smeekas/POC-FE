import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { MembersResponse } from '../dto/members.dto';

export function useGetMembers(filters: Record<string, string | undefined>) {
  return useQuery({
    queryKey: [QueryKey.MEMBERS, ...Object.values(filters)],
    queryFn: () =>
      axiosInstance.get<MembersResponse>(API_ENDPOINTS.MEMBERS.GET_MEMBERS, {
        params: filters,
      }),
  });
}
