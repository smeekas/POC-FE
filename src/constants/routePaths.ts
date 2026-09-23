/**
 * Every URL the router knows about.
 *
 * Components link and navigate through these constants only, so renaming a URL
 * is a one line change.
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '*',
} as const;
