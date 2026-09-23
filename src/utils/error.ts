import { AxiosError } from 'axios';

/** The error shape NestJS returns by default for a failed request. */
type NestErrorResponseBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Turns any thrown value into a single sentence we can safely show to the user.
 *
 * NestJS validation failures arrive as an array of messages, so we take the first one
 * rather than dumping the whole list into the UI.
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseBody = error.response?.data as NestErrorResponseBody | undefined;
    const message = responseBody?.message;

    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return FALLBACK_ERROR_MESSAGE;
};
