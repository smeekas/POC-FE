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
 */
export const ROLE_COLORS = {
  [UserRole.ADMIN]: 'purple',
  [UserRole.MEMBER]: 'gray',
} as const;
