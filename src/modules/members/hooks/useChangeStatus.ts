import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { InviteMemberUpdateEnum } from '../dto/invitedMembers.dto';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../../utils/error';

function useChangeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reqStatus,
    }: {
      id: number;
      reqStatus: InviteMemberUpdateEnum;
    }) =>
      axiosInstance.patch<APIResponse<null | { url: string }>>(
        API_ENDPOINTS.MEMBERS.UPDATE_INVITATION(id, reqStatus),
      ),
    onSuccess(data) {
      if (data.status === 200) {
        qc.invalidateQueries({ queryKey: [QueryKey.INVITED_MEMBERS] });
        toast.success(data.data.statusMessage);
      } else {
        toast.error(getApiErrorMessage(data.data));
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export default useChangeStatus;
