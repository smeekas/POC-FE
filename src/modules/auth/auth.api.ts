import { axiosInstance } from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../constants/endpoints';
import type {
  AuthResponseDto,
  LoginRequestDto,
  ProfileContextResponseDto,
  SignupRequestDto,
} from './auth.dto';

/**
 * Thin transport layer for the auth module.
 *
 * These functions only speak HTTP — caching, redirects and toasts belong to the
 * hooks in `auth.queries.ts`.
 */

/** Logs a user in and returns their access token plus profile. */
export const loginRequest = async (
  payload: LoginRequestDto,
): Promise<AuthResponseDto> => {
  const { data } = await axiosInstance.post<AuthResponseDto>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload,
  );

  return data;
};

/** Registers a new user and returns their access token plus profile. */
export const signupRequest = async (
  payload: SignupRequestDto,
): Promise<AuthResponseDto> => {
  const { data } = await axiosInstance.post<AuthResponseDto>(
    API_ENDPOINTS.AUTH.SIGNUP,
    payload,
  );

  return data;
};

/** Fetches the logged in user and their tenant context for the current token. */
export const fetchProfileContext =
  async (): Promise<ProfileContextResponseDto> => {
    const { data } = await axiosInstance.get<ProfileContextResponseDto>(
      API_ENDPOINTS.AUTH.PROFILE_CONTEXT,
    );

    return data;
  };
