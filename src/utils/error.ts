import { AxiosError, type AxiosResponse } from 'axios';

/** The error shape NestJS returns by default for a failed request. */
type NestErrorResponseBody = {
  status?: number;
  statusMessage: string;
};

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Turns any thrown value into a single sentence we can safely show to the user.
 *
 * NestJS validation failures arrive as an array of messages, so we take the first one
 * rather than dumping the whole list into the UI.
 */
export const getApiErrorMessage = (
  error:
    | AxiosError
    | Error
    | AxiosResponse<{
        data: unknown;
        status: number;
        statusMessage: string;
      }>['data'],
): string => {
  if (error instanceof AxiosError) {
    const responseBody = error.response?.data as
      | NestErrorResponseBody
      | undefined;
    const message = responseBody?.statusMessage;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message || FALLBACK_ERROR_MESSAGE;
  } else if ('request' in error) {
    return error.statusMessage;
  }

  return FALLBACK_ERROR_MESSAGE;
};
