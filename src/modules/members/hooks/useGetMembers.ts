import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';

export function useGetMembers() {
  return useQuery({
    queryKey: [QueryKey.MEMBERS],
    queryFn: () => axiosInstance.get(API_ENDPOINTS.MEMBERS.GET_MEMBERS),
  });
}
