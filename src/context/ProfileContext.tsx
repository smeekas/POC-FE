import { createContext, use, useMemo, type ReactNode } from 'react';

import { useProfileContextQuery } from '../modules/auth/hooks/useProfileContextQuery';
import type { ProfileRes } from '../types/profile.types';
import { FullPageLoader } from '../components/common/FullPageLoader';

export type ProfileContextValue = {
  /** The logged in user, or null while loading and when there is no valid session. */
  profile: ProfileRes | null;
  /** True while the profile call is in flight. */
  isLoading: boolean;
  /** True when the profile call failed, which for this endpoint means "not signed in". */
  isError: boolean;
};

const PROFILE_CONTEXT_DEFAULT: ProfileContextValue = {
  profile: null,
  isLoading: false,
  isError: false,
};

export const ProfileContext = createContext<ProfileContextValue>(
  PROFILE_CONTEXT_DEFAULT,
);

export type ProfileProviderProps = {
  children: ReactNode;
};

/**
 * Makes the logged in user available to the whole tree.
 *
 * The profile is fetched once through TanStack Query and shared from cache, so
 * consumers read the same user without every page firing its own request. The
 * provider always renders its children: deciding what to show while the session is
 * still unknown is the job of the route guards, not of this provider.
 */
export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { data, isLoading, isError } = useProfileContextQuery();

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile: data?.data ?? null,
      isLoading,
      isError,
    }),
    [data, isLoading, isError],
  );
  if (isLoading) return <FullPageLoader />;
  return <ProfileContext value={value}>{children}</ProfileContext>;
};

/** Reads the logged in user from context. */
export const useProfile = () => use(ProfileContext);
