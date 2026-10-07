import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import { setAccessToken } from '../../../utils/auth';
import type { LoginRequestDto, LoginResponseDto } from '../auth.dto';
import { useNavigate } from 'react-router';
import { ROUTE_PATHS } from '../../../constants/routePaths';

/**
 * Logs an existing user in.
 *
 * The response carries nothing but the token, so the profile context query is
 * invalidated to pull the rest of the user in right after.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginRequestDto) => {
      const { data } = await axiosInstance.post<APIResponse<LoginResponseDto>>(
        API_ENDPOINTS.AUTH.LOGIN,
        payload,
      );

      return data;
    },
    onSuccess: async (response) => {
      setAccessToken(response.data.access_token);
      console.log('save token');
      await queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey.includes(QueryKey.PROFILE_CONTEXT);
        },
      });
      console.log('navigate ');
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    },
  });
};
