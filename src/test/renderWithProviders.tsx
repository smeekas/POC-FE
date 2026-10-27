import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import { theme } from '../theme';

/** A throwaway query client with retries off so failures surface on the first attempt. */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

export type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient;
  initialEntries?: string[];
};

/** Builds the provider tree from `main.tsx` so hooks under test see the same context. */
export const createProviderWrapper = ({
  queryClient = createTestQueryClient(),
  initialEntries = ['/'],
}: Pick<RenderWithProvidersOptions, 'queryClient' | 'initialEntries'> = {}) => {
  return ({ children }: PropsWithChildren) => (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
};

/** Renders a component inside Mantine, TanStack Query and router providers. */
export const renderWithProviders = (
  ui: ReactElement,
  { queryClient, initialEntries, ...renderOptions }: RenderWithProvidersOptions = {},
) => {
  const client = queryClient ?? createTestQueryClient();

  return {
    queryClient: client,
    ...render(ui, {
      wrapper: createProviderWrapper({ queryClient: client, initialEntries }),
      ...renderOptions,
    }),
  };
};
