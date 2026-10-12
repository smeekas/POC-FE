import type { Ref, TextareaHTMLAttributes } from 'react';

import styles from './TextArea.module.css';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
};

/** The multi line counterpart to `TextInput`, used wherever a form needs prose. */
export const TextArea = ({
  invalid = false,
  className,
  ref,
  ...textareaProps
}: TextAreaProps) => {
  const textareaClassName = [
    styles.textarea,
    invalid ? styles.invalid : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <textarea
      ref={ref}
      className={textareaClassName}
      aria-invalid={invalid || undefined}
      {...textareaProps}
    />
  );
};
