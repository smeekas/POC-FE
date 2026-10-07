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
  },
} as const;
