import styles from '../../misc/pages/PlaceholderPage.module.css';

/**
 * Placeholder for the post-signup flow where a user creates a tenant or accepts an invite.
 *
 * Wired into the route tree now so signup has a real destination.
 */
export const OnboardingPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Onboarding</p>
      <h1 className={styles.title}>Set up your workspace</h1>
      <p className={styles.description}>
        Creating a tenant and accepting invites will be built here.
      </p>
    </section>
  );
};
