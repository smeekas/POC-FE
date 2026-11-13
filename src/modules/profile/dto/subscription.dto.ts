import type { APIResponse } from '../../../types/common.types';

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export enum Interval {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  QUARTER = 'QUARTER',
  WEEK = 'WEEK',
}
export type SubscriptionItem = {
  id: number;
  plan_id: number;
  created_at: string;
  started_at: string;
  ended_at: string | null;
  canceled_at: string | null;
  status: SubscriptionStatus;
  Plan: {
    name: string;
    billing_interval: Interval;
    /* End of the period this subscription is paid up to, not the day it was ended. */
    endDate: string;
  };
};

export type SubscriptionResponse = APIResponse<SubscriptionItem[]>;
