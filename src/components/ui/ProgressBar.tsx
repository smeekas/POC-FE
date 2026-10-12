import type { ReactNode } from 'react';

import styles from './ProgressBar.module.css';

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
    <div className={`${styles.root} ${styles[color]}`}>
      {(!hideValue || trailing) && (
        <div className={styles.meta}>
          {!hideValue && (
            <span className={styles.value}>
              {value} / {max}
            </span>
          )}
          {trailing}
        </div>
      )}

      <div
        className={styles.track}
        role='progressbar'
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${value} of ${max}`}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
