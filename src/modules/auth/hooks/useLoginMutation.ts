import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import { setAccessToken } from '../../../utils/auth';
import { getApiErrorMessage } from '../../../utils/error';
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
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(response.statusMessage);
        setAccessToken(response.data.access_token);
        queryClient.invalidateQueries({
          predicate(query) {
            return query.queryKey.includes(QueryKey.PROFILE_CONTEXT);
          },
        });
        if (response.data.redirect) {
          navigate(response.data.redirect, { replace: true });
        } else {
          navigate(ROUTE_PATHS.DOCUMENTS, { replace: true });
        }
      } else {
        toast.error(getApiErrorMessage(response));
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
