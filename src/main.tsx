import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';

import App from './App.tsx';
import { queryClient } from './api/queryClient';
import { ProfileProvider } from './context/ProfileContext';
import { theme } from './theme';

import '@mantine/core/styles.css';
import './index.css';

/**
 * Mantine owns the design tokens for the whole app.
 *
 * Everything renders inside `<MantineProvider>`, so component stylesheets can reach the
 * variables it generates from `theme.ts` (`--mantine-color-*`, `--mantine-spacing-*`,
 * `--mantine-radius-*`, `--mantine-shadow-*`, `--mantine-font-size-*`) instead of hand
 * rolled ones. Change the look of the app from `theme.ts` rather than from CSS.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme='light'>
      {createPortal(<Toaster position='top-center' />, document.body)}
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProfileProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
