import { Button, Flex, Text } from '@radix-ui/themes';
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
    <Flex
      className={styles.banner}
      align='center'
      justify='between'
      gap='3'
      wrap='wrap'
      px='4'
      py='3'
      mb='3'
    >
      <Text size='2' weight='medium'>
        {getLimitReachedMessage(plan, feature)}
      </Text>

      <Button asChild className={styles.cta} size='2' variant='outline'>
        <NavLink to={ROUTE_PATHS.PROFILE_SETTINGS}>Upgrade in settings</NavLink>
      </Button>
    </Flex>
  );
};
