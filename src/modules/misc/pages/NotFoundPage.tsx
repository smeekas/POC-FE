import { Link } from 'react-router';

import { Button } from '../../../components/ui/Button';
import { ROUTE_PATHS } from '../../../constants/routePaths';

import styles from './PlaceholderPage.module.css';

/** Shown for any URL the route tree does not recognise. */
export const NotFoundPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>404</p>
      <h1 className={styles.title}>This page does not exist</h1>
      <p className={styles.description}>
        The link may be out of date, or the page may have moved.
      </p>

      <Button asChild>
        <Link to={ROUTE_PATHS.ROOT}>Take me home</Link>
      </Button>
    </section>
  );
};
