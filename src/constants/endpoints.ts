/**
 * Every backend URL the app talks to, grouped by module.
 *
 * Static endpoints are plain strings; endpoints that need path params are functions
 * so callers never build URLs by hand. Paths are relative to the axios `baseURL`.
 */
export const API_ENDPOINTS = {
  AUTH: {
    /** Exchanges email + password for an access token. */
    LOGIN: 'auth/login',
    /** Registers a brand new user and returns an access token. */
    SIGNUP: 'auth/signup',
    /** Returns the logged in user together with their tenant context. Used for auth checks. */
    PROFILE_CONTEXT: 'me',
    /** Invalidates the current session on the server. */
    LOGOUT: 'auth/logout',
  },
  PLANS: 'plan',
  PLAN_USAGE: 'plan/usage',
  CHANGE_PLAN: 'tenant/change-plan',
  ONBOARDING: 'onboarding',
  MEMBERS: {
    GET_MEMBERS: 'users',
    INVITED_MEMBERS: 'invite',
    SEND_INVITATION: 'invite',
    ACCEPT_INVITE: 'invite/accept',
    UPDATE_INVITATION: (id: number, status: string) => `invite/${id}/${status}`,
    list: () => 'users/list',
    deleteInvitation: (id: number) => `invite/${id}`,
    changeRole: (id: number) => `users/${id}/role`,
  },
  DOCUMENT: {
    LIST: 'doc',
    BY_ID: (id: number) => `doc/${id}`,
    CREATE: 'doc',
    DELETE: (id: number) => `doc/${id}`,
  },
  Tags: 'tags',
  PlatformAdmin: {
    usage: '/platform-admin/usage',
    overview: '/platform-admin/overview',
  },
} as const;
