import DataTable from '../../../../components/common/DataTable/DataTable';
import { tenantFeatureColumns } from '../../columns/tenantFeatures.columns';

import type {
  TenantFeatureItem,
  TenantFeatureResponse,
} from '../../dto/feature.dto';
import type { ExpireOptionChange } from '../../platformAdmin.types';
import { FeatureRowExpand } from '../FeatureRowExpand/FeatureRowExpand';
import { Button } from '@mantine/core';
import styles from './TenantFeatureList.module.css';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import '@mantine/dates/styles.css';
import { useGetTenant } from '../../hooks/useGetTenant';
import { useUpdateFeatures } from '../../hooks/useUpdateFeatures';

type TenantFeatureListProps = {
  data: TenantFeatureResponse['data'];
};
function TenantFeatureList({ data: rows }: TenantFeatureListProps) {
  const tenantId = useGetTenant();
  const existingFeature = useRef<Map<number, TenantFeatureItem>>(new Map());
  useLayoutEffect(() => {
    rows.forEach((rowItem) => {
      if (rowItem.plan_feature === null) {
        existingFeature.current.set(rowItem.id, rowItem);
      }
    });
  }, [rows]);
  const { mutate } = useUpdateFeatures(tenantId);
  const [disableSet, setDisableSet] = useState<Set<number>>(new Set());
  const [enableMap, setEnableMap] = useState<
    Map<number, Parameters<ExpireOptionChange>[1]>
  >(new Map<number, Parameters<ExpireOptionChange>[1]>());

  const onExpireChange: ExpireOptionChange = (feature, value) => {
    setEnableMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(feature.id, value);
      return newMap;
    });
  };
  const onEnable = (featureId: number) => {
    if (disableSet.has(featureId)) {
      setDisableSet((prev) => {
        const newSet = new Set(prev);
        newSet.delete(featureId);
        return newSet;
      });
    }
    const existing = existingFeature.current.get(featureId);

    if (!existing || !existing.feature_value) {
      setEnableMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(featureId, { expires_at: null });
        return newMap;
      });
    }
  };
  const onDisable = (featureId: number) => {
    const currFeature = existingFeature.current.get(featureId);

    if (enableMap.has(featureId)) {
      if (currFeature && currFeature.feature_value) {
        setDisableSet((prev) => {
          const newSet = new Set(prev);
          newSet.add(featureId);
          return newSet;
        });
      }
      setEnableMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(featureId);
        return newMap;
      });
      return;
    }
    setDisableSet((prev) => {
      const newSet = new Set(prev);
      newSet.add(featureId);
      return newSet;
    });
  };
  const saveChanges = () => {
    // save changes
    mutate(
      {
        enable: [...enableMap.keys()].map((featureItem) => {
          const mapValue = enableMap.get(featureItem);
          return {
            feature_id: featureItem,
            expires_at: mapValue?.expires_at || undefined,
            feature_value: 'true',
          };
        }),
        disable: [...disableSet.values()],
      },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            setDisableSet(new Set());
            setEnableMap(new Map());
          }
        },
      },
    );
  };
  const isSaveBtnEnabled = useMemo(() => {
    return rows
      .map((rowItem) => {
        if (rowItem.plan_feature !== null) return false;
        // if (rowItem.feature_value === null) return false;
        const change = enableMap.has(rowItem.id);
        const isDisabled = disableSet.has(rowItem.id);
        return change || isDisabled;
      })
      .reduce((acc, curr) => acc + +curr, 0);
  }, [rows, enableMap, disableSet]);
  return (
    <div>
      <DataTable<TenantFeatureItem>
        columns={tenantFeatureColumns(onEnable, onDisable)}
        row={rows}
        defaultRowExpanded={(feature) =>
          feature.plan_feature === null && feature.feature_value !== null
        }
        expandRowRender={({ feature }) => {
          return (
            <FeatureRowExpand
              feature={feature}
              onChange={onExpireChange}
              current={enableMap.get(feature.id)}
            />
          );
        }}
      />
      {isSaveBtnEnabled > 0 && (
        <div className={styles.panel}>
          {enableMap.size + disableSet.size} unsaved changes
          <Button onClick={saveChanges}>Save changes</Button>
        </div>
      )}
    </div>
  );
}

export default TenantFeatureList;
