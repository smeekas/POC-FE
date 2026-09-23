import '../../misc/pages/placeholder-page.css';

/**
 * Placeholder for the post-signup flow where a user creates a tenant or accepts an invite.
 *
 * Wired into the route tree now so signup has a real destination.
 */
export const OnboardingPage = () => {
  return (
    <section className="placeholder-page">
      <p className="placeholder-page__eyebrow">Onboarding</p>
      <h1 className="placeholder-page__title">Set up your workspace</h1>
      <p className="placeholder-page__description">
        Creating a tenant and accepting invites will be built here.
      </p>
    </section>
  );
};
