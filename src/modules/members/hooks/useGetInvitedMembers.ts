import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { InvitedMemberResponse } from '../dto/invitedMembers.dto';

export function useGetInvitedMembers() {
  return useQuery({
    queryKey: [QueryKey.INVITED_MEMBERS],
    queryFn: () =>
      axiosInstance.get<InvitedMemberResponse>(
        API_ENDPOINTS.MEMBERS.INVITED_MEMBERS,
      ),
  });
}
