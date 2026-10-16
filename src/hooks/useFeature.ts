import { usePlan } from './usePlan';

/** A plan allowance that a tenant can run out of. */
export type PlanFeature = 'document' | 'user';

/** Whether the tenant has already used up its plan's allowance for a feature. */
export function useFeature(feature: PlanFeature) {
  const plan = usePlan();
  console.log(feature);
  if (feature === 'document') {
    return plan.documentLimitReached;
  }
  return plan.userLimitReached;
}
