import type { APIResponse } from '../../../types/common.types';

export type UserListResponse = APIResponse<{ id: number; email: string }[]>;
