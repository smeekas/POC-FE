import { Switch } from '@mantine/core';

import type { DataTableColumn } from '../../../components/common/DataTable/DataTable';
import type { TenantFeatureItem } from '../dto/feature.dto';

/** Columns of a tenant's feature list. */
export const tenantFeatureColumns: (
  onExpand: (featureId: number) => void,
  onDisable: (featureId: number) => void,
) => DataTableColumn<TenantFeatureItem>[] = (onExpand, onDisable) => [
  {
    name: 'Feature',
    identifier: 'feature_name',
    render: (feature) => (
      <>
        <p className='bold'>{feature.feature_name}</p>
        <p>{feature.feature_key}</p>
      </>
    ),
  },
  {
    name: 'From plan',
    identifier: 'plan_feature',
    render: (feature) =>
      feature.plan_feature
        ? `${feature.plan_feature.name} plan`
        : 'Not on any plan',
  },
  {
    name: 'Include',
    identifier: 'feature_value',
    render: (feature, { toggleExpand }) =>
      feature.plan_feature ? (
        'Uses plan value'
      ) : (
        <Switch
          defaultChecked={
            feature.plan_feature === null && feature.feature_value !== null
          }
          onChange={(e) => {
            const value = e.target.checked;
            toggleExpand();
            if (value) {
              onExpand(feature.id);
            } else {
              onDisable(feature.id);
            }
          }}
        />
      ),
  },
  {
    name: 'Effective',
    identifier: 'effective',
    render: (feature) => feature.feature_value,
  },
];
