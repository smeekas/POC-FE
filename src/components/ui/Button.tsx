import { Slot } from 'radix-ui';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './Button.css';

/** Visual weight of a button, from the main call to action down to a bare text button. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** How much visual weight the button carries. */
  variant?: ButtonVariant;
  /** Stretches the button to the full width of its container. */
  fluid?: boolean;
  /** Shows a spinner beside the label and blocks further clicks. */
  loading?: boolean;
  /**
   * Applies the button styling to the child element instead of rendering a `<button>`.
   * Use it to make a router `<Link>` look like a button.
   */
  asChild?: boolean;
  children: ReactNode;
};

/** Builds the class list for a button from its variant and layout flags. */
const buildButtonClassName = (
  variant: ButtonVariant,
  fluid: boolean,
  extraClassName?: string,
): string => {
  return ['button', `button--${variant}`, fluid ? 'button--fluid' : '', extraClassName ?? '']
    .filter(Boolean)
    .join(' ');
};

/** The one button in the app; everything clickable and action shaped uses it. */
export const Button = ({
  variant = 'primary',
  fluid = false,
  loading = false,
  asChild = false,
  disabled,
  className,
  children,
  ...buttonProps
}: ButtonProps) => {
  const buttonClassName = buildButtonClassName(variant, fluid, className);

  if (asChild) {
    return <Slot.Root className={buttonClassName}>{children}</Slot.Root>;
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={disabled || loading}
      aria-busy={loading}
      {...buttonProps}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
};
