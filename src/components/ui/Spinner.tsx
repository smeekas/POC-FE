import './Spinner.css';

export type SpinnerProps = {
  /** Diameter of the spinner. */
  size?: 'small' | 'medium' | 'large';
};

/** Indeterminate loading indicator. Decorative — pair it with visible text. */
export const Spinner = ({ size = 'medium' }: SpinnerProps) => {
  return <span className={`spinner spinner--${size}`} aria-hidden="true" />;
};
