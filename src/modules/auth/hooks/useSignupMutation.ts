import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';
import type { SignupRequestDto, SignupResponseDto } from '../auth.dto';

/**
 * Registers a new user.
 *
 * Signup only creates the account — no token comes back — so the user still has
 * to log in afterwards.
 */
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignupRequestDto) => {
      const { data } = await axiosInstance.post<APIResponse<SignupResponseDto>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        payload,
      );

      return data;
    },
  });
};
