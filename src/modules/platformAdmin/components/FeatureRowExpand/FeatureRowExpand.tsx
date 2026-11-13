import type { TenantFeatureItem } from '../../dto/feature.dto';
import CustomSelect from '../../../../components/ui/Select/CustomSelect';
import styles from './FeatureRowExpand.module.css';
import {
  Duration,
  type ExpireOptionChange,
  type FeatureOptionValue,
  type FeatureSelectOption,
} from '../../platformAdmin.types';
import {
  DURATION_LABELS,
  DURATION_VALUES,
} from '../../constants/featureDuration';
import { Button, SegmentedControl } from '@mantine/core';
import { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';

type FeatureRowExpandProps = {
  feature: TenantFeatureItem;
  onChange: ExpireOptionChange;
  current?: Parameters<ExpireOptionChange>[1];
};
export function FeatureRowExpand({
  feature,
  onChange,
  current,
}: FeatureRowExpandProps) {
  const [expiresValue, setExpiresValue] = useState<boolean>(false);
  const onValueChange = (value: FeatureSelectOption | null) => {
    if (value === null) {
      onChange(feature, null);
    } else if (value === 'never') {
      onChange(feature, { expires_at: null });
    } else {
      onChange(feature, {
        expires_at: dayjs(value, 'YYYY-MM-DD HH:mm:ss').utc().toISOString(),
      });
    }
  };
  const onExpiresValue = (value: 'Never' | 'On Date') => {
    if (value === 'Never') {
      setExpiresValue(false);
      onChange(feature, { expires_at: null });
    } else {
      onChange(feature, { expires_at: dayjs.utc().toISOString() });
      setExpiresValue(true);
    }
  };
  const onBtnClick = (duration: FeatureOptionValue) => {
    const currentDate = dayjs
      .utc(current?.expires_at || undefined)
      .add(duration.count, duration.unit)
      .toISOString();

    onChange(feature, {
      expires_at: currentDate,
    });
  };
  return (
    <div className={styles.feature_detail}>
      <p>Expires</p>
      <SegmentedControl
        defaultValue='Never'
        data={['Never', 'On Date']}
        onChange={(v) => onExpiresValue(v)}
      />
      {expiresValue && (
        <>
          <DateTimePicker
            placeholder='when feature should expire'
            defaultValue={dayjs().toDate()}
            value={current?.expires_at}
            onChange={(e) => {
              onValueChange(e);
            }}
          />
          {Object.keys(DURATION_LABELS).map((labelItem) => {
            return (
              <Button
                variant='white'
                key={labelItem}
                size='compact-sm'
                onClick={() => {
                  onBtnClick(DURATION_VALUES[labelItem as Duration]);
                }}
              >
                +{labelItem}
              </Button>
            );
          })}
        </>
      )}
    </div>
  );
}
