/**
 * The two roles a user can hold inside a tenant.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

/**
 * Badge colour per role, so a role reads the same wherever it is drawn.
 *
 * Only the role that carries authority gets the accent; everyone else stays neutral.
 * `undefined` is the accent: Mantine falls back to `theme.primaryColor` when a Badge is
 * given no colour, so the admin badge follows the theme instead of naming a palette.
 */
export const ROLE_COLORS = {
  [UserRole.ADMIN]: undefined,
  [UserRole.MEMBER]: 'gray',
} as const;
