import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { APIResponse } from '../../../types/common.types';
import { getApiErrorMessage } from '../../../utils/error';

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (reqBody: { token: string; password: string }) =>
      axiosInstance.post<APIResponse<null>>(
        API_ENDPOINTS.MEMBERS.ACCEPT_INVITE,
        reqBody,
      ),
    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
  });
}
