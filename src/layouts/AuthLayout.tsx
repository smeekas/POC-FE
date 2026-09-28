import { Outlet } from 'react-router';

import styles from './AuthLayout.module.css';

/**
 * Two column shell for the signed-out pages: brand panel on the left, form card on the right.
 *
 * The panel carries only the app name and a single statement; on narrow screens it is
 * hidden so the form gets the full width.
 */
export const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.brand}>
        <span className={styles.wordmark}>Fiiles</span>

        {/* Split across three lines on purpose, so the statement reads as a stack
            rather than wrapping wherever the panel happens to end. */}
        <h2 className={styles.statement}>
          <span>Documents for</span>
          <span>your whole team,</span>
          <span>in one workspace</span>
        </h2>
      </aside>

      <main className={styles.content}>
        <div className={styles.card}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
