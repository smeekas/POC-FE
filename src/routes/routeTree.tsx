import { Outlet } from 'react-router';

import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RootLayout } from '../layouts/RootLayout';
import { DocumentsPage } from '../modules/documents/pages/DocumentsPage';
import { MembersPage } from '../modules/members/pages/MembersPage';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { SignupPage } from '../modules/auth/pages/SignupPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { NotFoundPage } from '../modules/misc/pages/NotFoundPage';
import { OnboardingPage } from '../modules/onboarding/pages/OnboardingPage';
import type { AppRouteNode } from './route.types';
import Gateway from '../global/Gateway';
import UpgradePage from '../modules/onboarding/pages/UpgradePage';

/**
 * The application route tree.
 *
 * Everything sits inside `RootLayout`, a pathless node that owns the full height page.
 * Below it the tree splits on access: a signed-out branch guarded by `PublicRoute`, a
 * signed-in branch guarded by `PrivateRoute`, and the catch-all routes that need
 * neither. Layouts sit between a guard and its pages.
 */
export const appRouteTree: AppRouteNode[] = [
  {
    element: RootLayout,
    children: [
      {
        element: AuthLayout,
        path: '/',
        private: false,
        children: [
          { path: 'login', element: LoginPage },
          { path: 'signup', element: SignupPage },
        ],
      },
      {
        element: Outlet,
        path: '',
        private: true,
        guard: [Gateway],
        children: [
          {
            element: AppLayout,
            path: '/',
            children: [
              {
                path: 'dashboard',
                element: DashboardPage,
              },
              {
                path: 'documents',
                element: DocumentsPage,
              },
              {
                path: 'members',
                element: MembersPage,
              },
              {
                path: '',
                element: DashboardPage,
                index: true,
              },
            ],
          },
        ],
      },
      {
        element: Outlet,
        path: 'onboarding',
        private: true,
        children: [
          {
            element: OnboardingPage,
            path: '',
            index: true,
          },
          {
            // guard: [Gateway],
            element: UpgradePage,
            path: 'upgrade',
          },
        ],
      },
      {
        path: '*',
        element: NotFoundPage,
      },
    ],
  },
];
