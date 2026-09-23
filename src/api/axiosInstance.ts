import axios from 'axios';

import { ROUTE_PATHS } from '../constants/routePaths';
import { clearAccessToken, getAccessToken } from '../utils/auth';

/** Base URL of the NestJS backend. */
const API_BASE_URL = 'http://localhost:9009/';

/** The single axios client every API call in the app goes through. */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Attaches the stored access token to every outgoing request. */
axiosInstance.interceptors.request.use((requestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return requestConfig;
});

/**
 * Drops the stored token and sends the user back to login when the server says the
 * session is no longer valid.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error?.response?.status === 401;
    const isAlreadyOnLoginPage = window.location.pathname === ROUTE_PATHS.LOGIN;

    if (isUnauthorized && !isAlreadyOnLoginPage) {
      clearAccessToken();
      window.location.assign(ROUTE_PATHS.LOGIN);
    }

    return Promise.reject(error);
  },
);
