import { QueryClient } from '@tanstack/react-query';

/**
 * The app wide TanStack Query cache.
 *
 * Auth failures are already handled by the axios response interceptor, so queries do
 * not retry on them; a single retry covers genuinely flaky network calls.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
