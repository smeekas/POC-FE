import type { ProgressBarColor } from '../../../components/ui/ProgressBar';
import { TenantUsageEnum } from '../dto/usage.dto';

/**
 * How each usage state is drawn.
 *
 * Bar and badge share one map so a tenant that is at its limit reads red in both places;
 * splitting them is how the two drift apart.
 */
export const USAGE_STATUS_COLORS: Record<TenantUsageEnum, ProgressBarColor> = {
  [TenantUsageEnum.NORMAL]: 'green',
  [TenantUsageEnum.NEAR_LIMIT]: 'orange',
  [TenantUsageEnum.AT_LIMIT]: 'red',
};

/** The enum values are snake_case wire values, not something to show a person. */
export const USAGE_STATUS_LABELS: Record<TenantUsageEnum, string> = {
  [TenantUsageEnum.NORMAL]: 'Normal',
  [TenantUsageEnum.NEAR_LIMIT]: 'Near limit',
  [TenantUsageEnum.AT_LIMIT]: 'At limit',
};
