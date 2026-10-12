import { useProfile } from '../context/ProfileContext';

export function useIsPlatformAdmin() {
  const { profile } = useProfile();
  return profile && 'isPlatformAdmin' in profile
    ? profile.isPlatformAdmin
    : false;
}
