import type { APIResponse } from '../../../types/common.types';

export type UsageItem = {
  name: string;
  plan: {
    name: string;
    max_documents: number;
    max_user: number;
  };
  documents: number;
  docStatus: TenantUsageEnum;
  planStatus: TenantUsageEnum;
  users: number;
  updated_at: string;
};

export type TenantUsageResponse = APIResponse<UsageItem[]>;
export enum TenantUsageEnum {
  NORMAL = 'normal',
  NEAR_LIMIT = 'near_limit',
  AT_LIMIT = 'at_limit',
}
