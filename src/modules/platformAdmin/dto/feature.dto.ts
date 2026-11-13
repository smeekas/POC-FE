import type { APIResponse } from '../../../types/common.types';

export type FeatureItem = {
  id: number;
  feature_key: string;
  feature_name: string;
  description: string;
  feature_type: FeatureType;
  created_at: string;
};
export type FeatureResponse = APIResponse<FeatureItem[]>;
export enum FeatureType {
  Boolean = 'Boolean',
  Number = 'Number',
  String = 'String',
}

export type TenantFeatureItem = {
  id: number;
  feature_key: string;
  feature_name: string;
  description: string;
  feature_type: FeatureType;
  feature_value: string;
  plan_feature: { name: string } | null;
  expires_at: string | null;
};

export type TenantFeatureResponse = APIResponse<TenantFeatureItem[]>;

export type TenantFeatureUpdateRequest = {
  enable: { feature_id: number; feature_value: string; expires_at?: string }[];
  disable?: number[];
};
