import { Navigate } from 'react-router';

import { ROUTE_PATHS } from '../constants/routePaths';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { SignupPage } from '../modules/auth/pages/SignupPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { NotFoundPage } from '../modules/misc/pages/NotFoundPage';
import { OnboardingPage } from '../modules/onboarding/pages/OnboardingPage';
import { PrivateRoute } from './guards/PrivateRoute';
import { PublicRoute } from './guards/PublicRoute';
import type { AppRouteNode } from './route.types';

/**
 * The application route tree.
 *
 * The top level splits on access: a signed-out branch guarded by `PublicRoute`, a
 * signed-in branch guarded by `PrivateRoute`, and the catch-all routes that need
 * neither. Layouts sit between a guard and its pages.
 */
export const appRouteTree: AppRouteNode[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTE_PATHS.LOGIN, element: <LoginPage /> },
          { path: ROUTE_PATHS.SIGNUP, element: <SignupPage /> },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: ROUTE_PATHS.ONBOARDING, element: <OnboardingPage /> },
      { path: ROUTE_PATHS.DASHBOARD, element: <DashboardPage /> },
    ],
  },
  {
    path: ROUTE_PATHS.ROOT,
    element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    element: <NotFoundPage />,
  },
];
