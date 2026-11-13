import type { TenantFeatureItem } from './dto/feature.dto';

export enum Duration {
  FiveMinutes = '5 min',
  FifteenDays = '15 days',
  ThirtyDays = '30 days',
  NinetyDays = '90 days',
}
export type FeatureSelectOption = string | 'never';
export type FeatureOptionValue = { count: number; unit: 'm' | 'd' };
export type FeatureValue = {
  expires_at: string | null;
};
export type ExpireOptionChange = (
  feature: TenantFeatureItem,
  arg1: FeatureValue | null,
) => void;
export type FeatureMap = Map<number, FeatureValue | null>;
