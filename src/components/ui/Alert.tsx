import type { ReactNode } from 'react';

import './Alert.css';

/** Tone of an alert, which decides its colour and its screen reader urgency. */
export type AlertSeverity = 'error' | 'success' | 'info';

export type AlertProps = {
  /** Tone of the message. */
  severity?: AlertSeverity;
  /** Renders the message as plain inline text with no box, for field level errors. */
  simple?: boolean;
  /** Ties the alert to the control it describes, via `aria-describedby`. */
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
    'alert',
    `alert--${severity}`,
    simple ? 'alert--simple' : '',
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
