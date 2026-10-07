// for navigating in Navigate component, useNavigate etc...
// do not use in routes
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  UPGRADE: '/onboarding/upgrade',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/documents',
  MEMBERS: '/members',
  NOT_FOUND: '*',
} as const;
