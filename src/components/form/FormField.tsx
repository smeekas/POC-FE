import { Label } from 'radix-ui';
import type { ReactNode } from 'react';

import { Alert } from '../ui/Alert';

import './FormField.css';

export type FormFieldProps = {
  /** Id of the control this field wraps; ties the label and the error text to it. */
  inputId: string;
  /** Text shown above the control. */
  label: string;
  /** Validation message for this field, when it has failed. */
  error?: string;
  /** Optional helper text shown under the control while the field is valid. */
  hint?: string;
  /** The actual input control. */
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
    <div className="form-field">
      <Label.Root className="form-field__label" htmlFor={inputId}>
        {label}
      </Label.Root>

      {children}

      {hasError ? (
        <Alert id={`${inputId}-error`} severity="error" simple>
          {error}
        </Alert>
      ) : null}

      {!hasError && hint ? <p className="form-field__hint">{hint}</p> : null}
    </div>
  );
};
