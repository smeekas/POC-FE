import { Spinner } from '../ui/Spinner';

import './FullPageLoader.css';

export type FullPageLoaderProps = {
  /** Short sentence telling the user what is being loaded. */
  message?: string;
};

/** Centred spinner shown while the app decides what the user is allowed to see. */
export const FullPageLoader = ({
  message = 'Loading…',
}: FullPageLoaderProps) => {
  return (
    <div className="full-page-loader" role="status" aria-live="polite">
      <Spinner size="large" />
      <p className="full-page-loader__message">{message}</p>
    </div>
  );
};
