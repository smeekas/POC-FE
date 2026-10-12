import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';

function useTags() {
  return useQuery({
    queryKey: [QueryKey.TAGS],
    queryFn: () => axiosInstance.get<APIResponse<string[]>>(API_ENDPOINTS.Tags),
  });
}

export default useTags;
