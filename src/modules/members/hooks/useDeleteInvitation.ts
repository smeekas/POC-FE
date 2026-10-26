import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import toast from 'react-hot-toast';
import type { APIResponse } from '../../../types/common.types';
import { getApiErrorMessage } from '../../../utils/error';
import { QueryKey } from '../../../constants/queryKey';

export function useDeleteInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete<APIResponse<null>>(
        API_ENDPOINTS.MEMBERS.deleteInvitation(id),
      ),
    onSuccess(data) {
      if (data.status === 200) {
        toast.success(data.data.statusMessage);
        qc.invalidateQueries({ queryKey: [QueryKey.INVITED_MEMBERS] });
      } else {
        toast.error(getApiErrorMessage(data.data));
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
