import { Outlet } from 'react-router';

import './AuthLayout.css';

/** Selling points shown on the brand panel beside the auth forms. */
const BRAND_HIGHLIGHTS = [
  {
    title: 'One workspace per team',
    description:
      'Create a tenant, invite your people and keep every document in one place.',
  },
  {
    title: 'Roles that make sense',
    description:
      'Admins see everything across the tenant, members keep their own work private.',
  },
  {
    title: 'Plans you can grow into',
    description:
      'Start free and lift your user, document and tagging limits whenever you need to.',
  },
];

/**
 * Two column shell for the signed-out pages: brand story on the left, form card on the right.
 *
 * On narrow screens the brand panel is hidden so the form gets the full width.
 */
export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand">
        <div className="auth-layout__brand-header">
          <span className="auth-layout__logo">N</span>
          <span className="auth-layout__logo-text">Nest Workspace</span>
        </div>

        <div className="auth-layout__brand-body">
          <h2 className="auth-layout__brand-title">
            Everything your team writes, in one tidy workspace.
          </h2>

          <ul className="auth-layout__highlights">
            {BRAND_HIGHLIGHTS.map((highlight) => (
              <li className="auth-layout__highlight" key={highlight.title}>
                <span className="auth-layout__highlight-title">
                  {highlight.title}
                </span>
                <span className="auth-layout__highlight-description">
                  {highlight.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-layout__brand-footer">
          Multi tenant by design — your data never leaves your workspace.
        </p>
      </aside>

      <main className="auth-layout__content">
        <div className="auth-layout__card">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
