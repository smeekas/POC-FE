/**
 * Request and response shapes for the auth module.
 *
 * These mirror the NestJS DTOs one to one — when the backend contract changes,
 * this file is the only place that needs editing. Response types describe the
 * `data` field only; the envelope around them is `APIResponse`.
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

/** `data` of `POST auth/login`: the token is all the backend hands back. */
export type LoginResponseDto = {
  access_token: string;
};

/** `POST auth/signup` answers `201` with no payload, so its `data` is null. */
export type SignupResponseDto = null;
