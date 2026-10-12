import type { UserRole } from '../../../constants/role';
import type { PaginatedAPIResponse } from '../../../types/common.types';

export type MemberItem = {
  role: UserRole;
  id: number;
  email: string;
  created_at: string;
};
export type MembersResponse = PaginatedAPIResponse<MemberItem[]>;
