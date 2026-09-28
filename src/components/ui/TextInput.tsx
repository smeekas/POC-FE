import type { InputHTMLAttributes, Ref } from 'react';

import styles from './TextInput.module.css';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

/** The single styled text input used by every form in the app. */
export const TextInput = ({
  invalid = false,
  className,
  ref,
  ...inputProps
}: TextInputProps) => {
  const inputClassName = [styles.input, invalid ? styles.invalid : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <input
      ref={ref}
      className={inputClassName}
      aria-invalid={invalid || undefined}
      {...inputProps}
    />
  );
};
