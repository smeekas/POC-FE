import styles from './Spinner.module.css';

export type SpinnerProps = {
  size?: 'small' | 'medium' | 'large';
};

/** Indeterminate loading indicator. Decorative — pair it with visible text. */
export const Spinner = ({ size = 'medium' }: SpinnerProps) => {
  return (
    <span
      className={`${styles.spinner} ${styles[size]}`}
      aria-hidden="true"
    />
  );
};
