import { Badge } from '@mantine/core';
import dayjs from 'dayjs';

import type { DataTableColumn } from '../../../components/common/DataTable/DataTable';
import { DateFormats } from '../../../constants/dateFormats';
import type { SubscriptionItem } from '../dto/subscription.dto';
import { Interval, SubscriptionStatus } from '../dto/subscription.dto';

/** Stands in for a date the subscription has not reached yet. */
const EMPTY_VALUE = '—';

/**
 * How each subscription state is drawn.
 *
 * A subscription the workspace is still paying for reads green, one it will lose soon
 * reads blue, and the two dead states read grey and red so a glance down the column
 * separates history from what is live.
 */
const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'green',
  [SubscriptionStatus.TRIALING]: 'blue',
  [SubscriptionStatus.EXPIRED]: 'gray',
  [SubscriptionStatus.CANCELED]: 'red',
};

/** The enum values are wire values, not something to show a person. */
const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Active',
  [SubscriptionStatus.TRIALING]: 'Trialing',
  [SubscriptionStatus.EXPIRED]: 'Expired',
  [SubscriptionStatus.CANCELED]: 'Canceled',
};

const INTERVAL_LABELS: Record<Interval, string> = {
  [Interval.WEEK]: 'Weekly',
  [Interval.MONTH]: 'Monthly',
  [Interval.QUARTER]: 'Quarterly',
  [Interval.YEAR]: 'Yearly',
};

/** A date the server may not have filled, drawn the same way everywhere in the table. */
const formatDate = (value: string | null) =>
  value ? dayjs(value).format(DateFormats.DATE_MONTH_YEAR) : EMPTY_VALUE;

/**
 * Columns of the subscription history.
 *
 * The endpoint hands back the whole history at once, so ordering is the table's own
 * (`sorter`) rather than something the page has to refetch for. It opens newest first,
 * which puts the subscription currently in force at the top.
 */
export const subscriptionColumns: DataTableColumn<SubscriptionItem>[] = [
  {
    name: 'Plan',
    identifier: 'plan',
    sorter: (a, b) => a.Plan.name.localeCompare(b.Plan.name) < 0,
    render: (subscription) => (
      <Badge variant='light' color='gray'>
        {subscription.Plan.name}
      </Badge>
    ),
  },
  {
    name: 'Billing',
    identifier: 'billing_interval',
    render: (subscription) =>
      INTERVAL_LABELS[subscription.Plan.billing_interval] ??
      subscription.Plan.billing_interval,
  },
  {
    name: 'Status',
    identifier: 'status',
    render: (subscription) => (
      <Badge variant='light' color={STATUS_COLORS[subscription.status]}>
        {STATUS_LABELS[subscription.status] ?? subscription.status}
      </Badge>
    ),
  },
  {
    name: 'Started',
    identifier: 'started_at',
    sorter: (a, b) => dayjs(a.started_at).isBefore(b.started_at),
    render: (subscription) => formatDate(subscription.started_at),
  },
  {
    /* `ended_at` is the day it actually stopped; until then the only end in sight is the
       period the plan is paid up to. */
    name: 'Ends on',
    identifier: 'ended_at',
    render: (subscription) =>
      formatDate(subscription.ended_at ?? subscription.Plan.endDate),
  },
  {
    name: 'Canceled',
    identifier: 'canceled_at',
    render: (subscription) => formatDate(subscription.canceled_at),
  },
];
