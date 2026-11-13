import type { FeatureOptionValue } from '../platformAdmin.types';
import { Duration } from '../platformAdmin.types';

/** What each duration is called in the picker. */
export const DURATION_LABELS: Record<Duration, string> = {
  [Duration.FiveMinutes]: '5 minutes',
  [Duration.FifteenDays]: '15 days',
  [Duration.ThirtyDays]: '30 days',
  [Duration.NinetyDays]: '90 days',
};

/** The same durations as the server wants them: a count and a unit. */
export const DURATION_VALUES: Record<Duration, FeatureOptionValue> = {
  [Duration.FifteenDays]: { count: 15, unit: 'd' },
  [Duration.FiveMinutes]: { count: 5, unit: 'm' },
  [Duration.NinetyDays]: { count: 90, unit: 'd' },
  [Duration.ThirtyDays]: { count: 30, unit: 'd' },
};
