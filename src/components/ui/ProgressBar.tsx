import { Group, Progress, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

export type ProgressBarColor = 'gray' | 'green' | 'orange' | 'red';

export type ProgressBarProps = {
  value: number;
  max: number;
  color?: ProgressBarColor;
  /** Names the bar for a screen reader, and is read out alongside the numbers. */
  label?: string;
  /** Sits opposite the numbers, above the bar. A status badge, usually. */
  trailing?: ReactNode;
  /** Hides the `3 / 10` caption when the surrounding cell already says it. */
  hideValue?: boolean;
};

/**
 * A horizontal usage bar, captioned above by its numbers.
 *
 * It takes a colour rather than deriving one, because what counts as a healthy fill
 * differs per thing measured; the caller decides and this only draws it.
 */
export const ProgressBar = ({
  value,
  max,
  color = 'gray',
  label,
  trailing,
  hideValue = false,
}: ProgressBarProps) => {
  /* An unlimited or missing ceiling would divide by zero, so it reads as empty rather
     than as full. The fill is clamped because usage can legitimately exceed its cap. */
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <Stack gap='2xs'>
      {(!hideValue || trailing) && (
        <Group justify='space-between' align='center' gap='xs' wrap='nowrap'>
          {!hideValue && (
            <Text size='xs' c='dimmed'>
              {value} / {max}
            </Text>
          )}
          {trailing}
        </Group>
      )}

      <Progress
        value={percent}
        color={color}
        size='sm'
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${value} of ${max}`}
      />
    </Stack>
  );
};

export default ProgressBar;
