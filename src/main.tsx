import { Theme } from '@radix-ui/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App.tsx';
import { queryClient } from './api/queryClient';
import { ProfileProvider } from './context/ProfileContext';

/* Only the tokens: the app styles its own components, so the Radix Themes component
   and utility stylesheets would be dead weight. Import `styles.css` instead the day we
   start rendering Radix Themes components. */
import '@radix-ui/themes/styles.css';
import './index.css';

/**
 * Radix Themes owns the design tokens for the whole app.
 *
 * Everything renders inside `<Theme>`, so component stylesheets can reach the token
 * variables it defines (`--accent-*`, `--gray-*`, `--space-*`, `--radius-*`,
 * `--shadow-*`, `--font-size-*`) instead of hand rolled ones. Change the look of the
 * app from these props rather than from CSS.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme
      accentColor='purple'
      grayColor='slate'
      radius='medium'
      scaling='100%'
      appearance='light'
    >
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProfileProvider>
      </QueryClientProvider>
    </Theme>
  </StrictMode>,
);
