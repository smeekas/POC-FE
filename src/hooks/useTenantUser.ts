import { useProfile } from '../context/ProfileContext';
import type { ProfileRes } from '../types/profile.types';

export function useTenantUser() {
  const profile = useProfile();
  if (profile.profile && 'require_onboarding' in profile.profile) {
    return { ...profile, profile: profile.profile as ProfileRes };
  }
  throw new Error('not tenant user');
}
