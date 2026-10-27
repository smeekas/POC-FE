import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import type { UserRole } from '../../../constants/role';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import toast from 'react-hot-toast';
import type { APIResponse } from '../../../types/common.types';
import { getApiErrorMessage } from '../../../utils/error';

type ChangeRoleRequest = {
  id: number;
  role: UserRole;
};
export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: ChangeRoleRequest) =>
      axiosInstance.patch<APIResponse<null>>(
        API_ENDPOINTS.MEMBERS.changeRole(id),
        { role },
      ),
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success(data.data.statusMessage);
        qc.invalidateQueries({ queryKey: [QueryKey.MEMBERS] });
      } else {
        toast.error(getApiErrorMessage(data.data));
      }
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });
}
