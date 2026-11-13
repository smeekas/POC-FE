import type { APIResponse } from '../../../types/common.types';

export type TenantDetailRes = {
  id: string;
  name: string;
  status: string;
  plan: {
    name: string;
  };
};

export type TenantDetailResponse = APIResponse<TenantDetailRes>;
