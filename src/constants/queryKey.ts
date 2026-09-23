/**
 * Every TanStack Query cache key used in the app.
 *
 * Using an enum instead of loose strings keeps keys discoverable and makes
 * invalidation typo proof.
 */
export enum QueryKey {
  /** The logged in user and their tenant context. */
  PROFILE_CONTEXT = 'PROFILE_CONTEXT',
}
