import { Button, Flex, Tooltip } from '@radix-ui/themes';
import type { ComponentProps } from 'react';

import { useFeature, type PlanFeature } from '../../hooks/useFeature';
import { usePlan } from '../../hooks/usePlan';
import { getLimitReachedMessage } from '../../utils/plan';

export type ActionButtonProps = ComponentProps<typeof Button> & {
  feature: PlanFeature;
};

/**
 * A button for an action the plan can run out of, such as creating a document or
 * inviting a member. It disables itself once that feature's limit is reached, so no
 * caller has to remember the check.
 */
export const ActionButton = ({
  feature,
  disabled,
  ...buttonProps
}: ActionButtonProps) => {
  const plan = usePlan();
  const isLimitReached = useFeature(feature);

  const button = (
    <Button {...buttonProps} disabled={disabled || isLimitReached} />
  );

  if (!isLimitReached) return button;

  /* A disabled button receives no pointer events, so the tooltip listens on a wrapper
     around it. The wrapper is focusable to keep the explanation reachable by keyboard. */
  return (
    <Tooltip
      content={`${getLimitReachedMessage(plan, feature)} Upgrade in settings to add more.`}
    >
      <Flex display='inline-flex' tabIndex={0}>
        {button}
      </Flex>
    </Tooltip>
  );
};
