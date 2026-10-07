import { Outlet } from 'react-router';

import styles from './RootLayout.module.css';

/** Shell every route renders inside; owns the full height page so no page repeats it. */
export const RootLayout = () => {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};
