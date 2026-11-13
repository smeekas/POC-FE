// for navigating in Navigate component, useNavigate etc...
// do not use in routes
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  UPGRADE: '/onboarding/upgrade',
  DOCUMENTS: '/documents',
  CREATE_DOCUMENT: '/documents/create',
  EDIT_DOCUMENT: (id: number) => `/documents/${id}`,
  MEMBERS: '/members',
  PROFILE_SETTINGS: '/profile-settings',
  PLATFORM_ADMIN_DASHBOARD: '/platform-admin/dashboard',
  PLATFORM_ADMIN_SETTINGS: '/platform-admin/settings',
  PLATFORM_ADMIN_FEATURES: '/platform-admin/features',
  PLATFORM_ADMIN_TENANT_DETAIL: (id: string) => `/platform-admin/tenants/${id}`,
  ACCEPT_INVITATION: '/accept',
  NOT_FOUND: '*',
} as const;
