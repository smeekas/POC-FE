import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { InviteMemberRequest } from '../dto/invitedMembers.dto';
import type { APIResponse } from '../../../types/common.types';
import { QueryKey } from '../../../constants/queryKey';

function useSendInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reqBody: InviteMemberRequest) =>
      axiosInstance.post<APIResponse<{ url: string }>>(
        API_ENDPOINTS.MEMBERS.SEND_INVITATION,
        reqBody,
      ),
    onSuccess(data) {
      if (data.status === 200) {
        qc.invalidateQueries({ queryKey: [QueryKey.INVITED_MEMBERS] });
      }
    },
  });
}

export default useSendInvitation;
