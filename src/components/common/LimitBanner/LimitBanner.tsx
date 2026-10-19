import { Button, Group, Text } from '@mantine/core';
import { NavLink } from 'react-router';

import { ROUTE_PATHS } from '../../../constants/routePaths';
import type { PlanFeature } from '../../../hooks/useFeature';
import { usePlan } from '../../../hooks/usePlan';
import { getLimitReachedMessage } from '../../../utils/plan';

import styles from './LimitBanner.module.css';

export type LimitBannerProps = {
  feature: PlanFeature;
};

/** Says which plan limit the tenant has run into, with the way out on the far right. */
export const LimitBanner = ({ feature }: LimitBannerProps) => {
  const plan = usePlan();

  return (
    <Group
      className={styles.banner}
      align='center'
      justify='space-between'
      gap='sm'
      wrap='wrap'
      px='md'
      py='sm'
      mb='sm'
    >
      <Text size='sm' fw={500}>
        {getLimitReachedMessage(plan, feature)}
      </Text>

      <Button
        component={NavLink}
        to={ROUTE_PATHS.PROFILE_SETTINGS}
        className={styles.cta}
        size='sm'
        variant='white'
      >
        Upgrade in settings
      </Button>
    </Group>
  );
};
