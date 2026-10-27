import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { AuthFormHeader } from './AuthFormHeader';

describe('AuthFormHeader', () => {
  it('renders the title as the page heading', () => {
    renderWithProviders(
      <AuthFormHeader title='Welcome back' subtitle='Sign in to continue.' />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome back' }),
    ).toBeInTheDocument();
  });

  it('renders the subtitle alongside it', () => {
    renderWithProviders(
      <AuthFormHeader title='Welcome back' subtitle='Sign in to continue.' />,
    );

    expect(screen.getByText('Sign in to continue.')).toBeInTheDocument();
  });

  it('keeps the subtitle out of the heading so the accessible name stays short', () => {
    renderWithProviders(
      <AuthFormHeader
        title='Create your account'
        subtitle='Start a workspace, or join one.'
      />,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /^Create your account$/,
    );
  });
});
