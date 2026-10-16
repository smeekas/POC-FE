import { Outlet } from 'react-router';

import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PlatformAdminLayout } from '../layouts/PlatformAdminLayout';
import { RootLayout } from '../layouts/RootLayout';
import { PlatformAdminDashboardPage } from '../modules/platformAdmin/pages/PlatformAdminDashboardPage';
import { PlatformAdminSettingsPage } from '../modules/platformAdmin/pages/PlatformAdminSettingsPage';
import { CreateDocumentPage } from '../modules/documents/pages/CreateDocumentPage';
import { DocumentsPage } from '../modules/documents/pages/DocumentsPage';
import { MembersPage } from '../modules/members/pages/MembersPage';
import { ProfileSettingsPage } from '../modules/profile/pages/ProfileSettingsPage';
import AcceptInvitation from '../modules/misc/pages/AcceptInvitation/AcceptInvitation';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { SignupPage } from '../modules/auth/pages/SignupPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { NotFoundPage } from '../modules/misc/pages/NotFoundPage';
import { OnboardingPage } from '../modules/onboarding/pages/OnboardingPage';
import type { AppRouteNode } from './route.types';
import Gateway from '../global/Gateway';
import UpgradePage from '../modules/onboarding/pages/UpgradePage';
import PlatformAdminGuard from '../guards/PlatformAdminGuard';
import TenantUserGuard from '../guards/TenantUserGuard';

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
          { path: 'accept-invitation', element: AcceptInvitation },
        ],
      },
      {
        path: '/',
        private: true,
        index: true,
        element: DashboardPage,
      },
      {
        element: Outlet,
        path: '',
        private: true,
        guard: [Gateway, TenantUserGuard],
        children: [
          {
            element: AppLayout,
            path: '/',
            children: [
              {
                path: 'documents',
                element: DocumentsPage,
              },
              {
                path: 'documents/create',
                element: CreateDocumentPage,
              },
              {
                path: 'documents/:id',
                element: CreateDocumentPage,
              },
              {
                path: 'members',
                element: MembersPage,
              },
              {
                path: 'profile-settings',
                element: ProfileSettingsPage,
              },
            ],
          },
        ],
      },
      {
        element: PlatformAdminLayout,
        path: '/platform-admin',
        guard: [PlatformAdminGuard],
        private: true,
        children: [
          {
            path: 'dashboard',
            element: PlatformAdminDashboardPage,
          },
          {
            path: 'settings',
            element: PlatformAdminSettingsPage,
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
            element: UpgradePage,
            path: 'upgrade',
          },
        ],
      },
      {
        element: AcceptInvitation,
        path: 'accept',
      },
      {
        path: '*',
        element: NotFoundPage,
      },
    ],
  },
];
