import { Spinner } from '../ui/Spinner';

import styles from './FullPageLoader.module.css';

export type FullPageLoaderProps = {
  message?: string;
};

/** Centred spinner shown while the app decides what the user is allowed to see. */
export const FullPageLoader = ({ message }: FullPageLoaderProps) => {
  return (
    <div className={styles.loader} role='status' aria-live='polite'>
      <Spinner size='large' />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
