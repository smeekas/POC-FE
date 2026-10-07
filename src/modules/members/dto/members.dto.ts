import type { UserRole } from '../../../constants/role';
import type { PaginatedAPIResponse } from '../../../types/common.types';

type MemberItem = { role: UserRole; id: number; email: string };
export type MembersResponse = PaginatedAPIResponse<MemberItem[]>;
