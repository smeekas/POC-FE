/**
 * Local storage helpers for the header based auth scheme.
 *
 * The access token is the only thing we persist; everything else about the user is
 * re-fetched from the profile context endpoint on boot.
 */

const ACCESS_TOKEN_STORAGE_KEY = 'access_token';

/** Reads the stored access token, or null when the user has never logged in. */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

/** Persists the access token returned by the login or signup endpoint. */
export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

/** Removes the access token, effectively logging the user out on this device. */
export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

/** Tells whether this browser is holding a token, without saying if it is still valid. */
export const hasAccessToken = (): boolean => {
  return Boolean(getAccessToken());
};
