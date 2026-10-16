import type { PlanFeature } from '../hooks/useFeature';
import type { ProfileRes } from '../types/profile.types';

type Plan = NonNullable<ProfileRes['plan']>;

/** One sentence naming the allowance of the current plan that has run out. */
export const getLimitReachedMessage = (plan: Plan, feature: PlanFeature) => {
  const limit = feature === 'document' ? plan.max_documents : plan.max_user;
  const noun = feature === 'document' ? 'documents' : 'members';

  return `Limit reached. The ${plan.name.toLowerCase()} plan allows ${limit} ${noun}.`;
};
