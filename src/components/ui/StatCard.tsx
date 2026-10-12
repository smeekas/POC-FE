import { Card } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import styles from './StatCard.module.css';

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
    <Card size='2' className={styles[color]}>
      <div className={styles.root}>
        {icon && <span className={styles.icon}>{icon}</span>}

        <div className={styles.body}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value ?? EMPTY_VALUE}</span>
          {hint && <span className={styles.hint}>{hint}</span>}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
