import { Box, Button, Tooltip, type ButtonProps } from '@mantine/core';
import type { ComponentPropsWithoutRef } from 'react';

import { useFeature, type PlanFeature } from '../../hooks/useFeature';
import { usePlan } from '../../hooks/usePlan';
import { getLimitReachedMessage } from '../../utils/plan';

/* Mantine's Button is polymorphic, so its props come from `ButtonProps` plus the
   intrinsic button attributes rather than from `ComponentProps<typeof Button>`. */
export type ActionButtonProps = ButtonProps &
  ComponentPropsWithoutRef<'button'> & {
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
      label={`${getLimitReachedMessage(plan, feature)} Upgrade in settings to add more.`}
      multiline
      w={260}
    >
      <Box display='inline-flex' tabIndex={0}>
        {button}
      </Box>
    </Tooltip>
  );
};
