import { Badge } from '@radix-ui/themes';

import type { DataTableColumn } from '../../../components/common/DataTable/DataTable';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import {
  USAGE_STATUS_COLORS,
  USAGE_STATUS_LABELS,
} from '../constants/usageStatus';
import type { UsageItem } from '../dto/usage.dto';
import { TenantUsageEnum } from '../dto/usage.dto';
import dayjs from 'dayjs';

type QuotaCellProps = {
  value: number;
  max: number;
  status: TenantUsageEnum;
  label: string;
};

/**
 * One quota: how full it is on the left, what the server called it on the right.
 *
 * The two belong in a single cell because the badge is the bar's verdict, not a separate
 * fact; both sides take their colour from the same status so they always agree.
 */
const QuotaCell = ({ value, max, status, label }: QuotaCellProps) => (
  <ProgressBar
    value={value}
    max={max}
    color={USAGE_STATUS_COLORS[status]}
    label={label}
    trailing={
      <Badge color={USAGE_STATUS_COLORS[status]}>
        {USAGE_STATUS_LABELS[status]}
      </Badge>
    }
  />
);

/** Columns of the tenant usage list. */
export const getUsageColumns = (): DataTableColumn<UsageItem>[] => [
  {
    name: 'Tenant',
    identifier: 'name',
    render: (usage) => usage.name,
  },
  {
    name: 'Plan',
    identifier: 'plan',
    render: (usage) => (
      <Badge variant='soft' color='gray'>
        {usage.plan.name}
      </Badge>
    ),
  },
  {
    name: 'Documents',
    identifier: 'documents',
    render: (usage) => (
      <QuotaCell
        value={usage.documents}
        max={usage.plan.max_documents}
        status={usage.docStatus}
        label={`${usage.name} document usage`}
      />
    ),
  },
  {
    name: 'Users',
    identifier: 'users',
    render: (usage) => (
      <QuotaCell
        value={usage.users}
        max={usage.plan.max_user}
        status={usage.planStatus}
        label={`${usage.name} user usage`}
      />
    ),
  },
  {
    name: 'Last updated',
    identifier: 'updated_at',
    render: (usage) => <p>{dayjs(usage.updated_at).from(dayjs())}</p>,
  },
];
