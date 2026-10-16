import type { ReactNode } from 'react';

import { LimitBanner } from '../components/common/LimitBanner/LimitBanner';
import { useFeature, type PlanFeature } from '../hooks/useFeature';

export type LimitGuardProps = {
  feature: PlanFeature;
  children?: ReactNode;
};

/**
 * Swaps whatever it guards for the limit banner once that plan feature is exhausted.
 *
 * Used without children it is simply the banner, shown only when there is something to
 * say.
 */
export const LimitGuard = ({ feature, children }: LimitGuardProps) => {
  const isLimitReached = useFeature(feature);

  if (isLimitReached) return <LimitBanner feature={feature} />;
  return children;
};
