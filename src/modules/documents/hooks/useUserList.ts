import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { UserListResponse } from '../dto/userList.dto';

export function useUserList() {
  return useQuery({
    queryKey: [QueryKey.Member_list],
    queryFn: () =>
      axiosInstance.get<UserListResponse>(API_ENDPOINTS.MEMBERS.list()),
  });
}
