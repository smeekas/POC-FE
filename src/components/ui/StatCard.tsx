import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import type { ReactNode } from 'react';

export type StatCardColor = 'gray' | 'green' | 'orange' | 'red';

export type StatCardProps = {
  label: string;
  /** `undefined` while the number is still in flight, so the card can hold its place. */
  value?: number;
  /** A line under the figure saying what it is a share of, or what it means. */
  hint?: string;
  icon?: ReactNode;
  color?: StatCardColor;
};

/** Stands in for a figure that has not arrived yet. */
const EMPTY_VALUE = '—';

/** A single headline figure: what it counts, the count, and what the count means. */
export const StatCard = ({
  label,
  value,
  hint,
  icon,
  color = 'gray',
}: StatCardProps) => {
  return (
    <Paper withBorder p='md' radius='md'>
      <Group align='flex-start' gap='sm' wrap='nowrap'>
        {icon && (
          <ThemeIcon variant='light' color={color} size='lg' radius='md'>
            {icon}
          </ThemeIcon>
        )}

        <Stack gap={2}>
          <Text size='xs' c='dimmed' fw={500}>
            {label}
          </Text>
          <Text size='2xl' fw={700} lh={1.2}>
            {value ?? EMPTY_VALUE}
          </Text>
          {hint && (
            <Text size='xs' c='dimmed'>
              {hint}
            </Text>
          )}
        </Stack>
      </Group>
    </Paper>
  );
};

export default StatCard;
