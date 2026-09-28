import type { ReactNode } from 'react';

import styles from './Alert.module.css';

/** Tone of an alert, which decides its colour and its screen reader urgency. */
export type AlertSeverity = 'error' | 'success' | 'info';

export type AlertProps = {
  severity?: AlertSeverity;
  simple?: boolean;
  id?: string;
  children: ReactNode;
};

/**
 * Inline feedback message, used for both form field errors and whole form failures.
 *
 * Errors are announced assertively so a failed submit is not missed by screen readers.
 */
export const Alert = ({
  severity = 'info',
  simple = false,
  id,
  children,
}: AlertProps) => {
  const alertClassName = [
    styles.alert,
    styles[severity],
    simple ? styles.simple : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p
      id={id}
      className={alertClassName}
      role={severity === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
};
