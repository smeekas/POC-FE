import { Label } from 'radix-ui';
import type { ReactNode } from 'react';

import { Alert } from '../ui/Alert';

import styles from './FormField.module.css';

export type FormFieldProps = {
  inputId: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

/**
 * Standard label + control + message stack used by every form in the app.
 *
 * Keeping the arrangement in one place means all forms line up and announce errors
 * to screen readers the same way.
 */
export const FormField = ({
  inputId,
  label,
  error,
  hint,
  children,
}: FormFieldProps) => {
  const hasError = Boolean(error);

  return (
    <div className={styles.field}>
      <Label.Root className={styles.label} htmlFor={inputId}>
        {label}
      </Label.Root>

      {children}

      {hasError ? (
        <Alert id={`${inputId}-error`} severity="error" simple>
          {error}
        </Alert>
      ) : null}

      {!hasError && hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
};
