import type { APIResponse } from '../../../types/common.types';

/** Platform wide counts as `GET platform-admin/overview` returns them. */
export type OverviewItem = {
  tenantCount: number;
  paidTenants: number;
  atLimit: number;
};

export type TenantOverviewResponse = APIResponse<OverviewItem>;
