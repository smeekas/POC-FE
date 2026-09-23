import type { InputHTMLAttributes, Ref } from 'react';

import './TextInput.css';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Marks the field red and tells assistive tech the value was rejected. */
  invalid?: boolean;
  /** Forwarded to the underlying input so react-hook-form can focus it. */
  ref?: Ref<HTMLInputElement>;
};

/** The single styled text input used by every form in the app. */
export const TextInput = ({
  invalid = false,
  className,
  ref,
  ...inputProps
}: TextInputProps) => {
  const inputClassName = ['text-input', invalid ? 'text-input--invalid' : '', className ?? '']
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
