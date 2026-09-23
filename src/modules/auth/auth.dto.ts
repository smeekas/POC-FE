import type { UserRole } from '../../constants/role';

/**
 * Request and response shapes for the auth module.
 *
 * These mirror the NestJS DTOs one to one — when the backend contract changes,
 * this file is the only place that needs editing.
 */

/** Body sent to `POST auth/login`. */
export type LoginRequestDto = {
  email: string;
  password: string;
};

/** Body sent to `POST auth/signup`. */
export type SignupRequestDto = {
  name: string;
  email: string;
  password: string;
};

/** The logged in user as the backend describes them. */
export type AuthUserDto = {
  id: string;
  name: string;
  email: string;
  /** Null until the user creates or joins a tenant during onboarding. */
  role: UserRole | null;
};

/** The tenant the user currently belongs to. */
export type AuthTenantDto = {
  id: string;
  name: string;
  planId: string;
};

/** Response returned by both `POST auth/login` and `POST auth/signup`. */
export type AuthResponseDto = {
  accessToken: string;
  user: AuthUserDto;
};

/**
 * Response of `GET auth/profile-context`, the endpoint private routes use to decide
 * whether the stored token still represents a valid session.
 */
export type ProfileContextResponseDto = {
  user: AuthUserDto;
  /** Null when the user is not part of any tenant yet and must go through onboarding. */
  tenant: AuthTenantDto | null;
};
