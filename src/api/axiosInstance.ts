import axios from 'axios';

import { ROUTE_PATHS } from '../constants/routePaths';
import { clearAccessToken, getAccessToken } from '../utils/auth';

/** The single axios client every API call in the app goes through. */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/** Attaches the stored access token to every outgoing request. */
axiosInstance.interceptors.request.use((requestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return requestConfig;
});
const skip = [
  ROUTE_PATHS.LOGIN,
  ROUTE_PATHS.SIGNUP,
  ROUTE_PATHS.ACCEPT_INVITATION,
] as string[];
/**
 * Drops the stored token and sends the user back to login when the server says the
 * session is no longer valid.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error?.response?.status === 401;
    const isAlreadyOnLoginPage = skip.includes(window.location.pathname);
    if (isUnauthorized && !isAlreadyOnLoginPage) {
      clearAccessToken();
      window.location.assign(ROUTE_PATHS.LOGIN);
    }

    return Promise.reject(error);
  },
);
