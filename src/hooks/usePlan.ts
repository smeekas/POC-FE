import { useProfile } from '../context/ProfileContext';

export function usePlan() {
  const profile = useProfile();
  if (!profile.profile?.plan) throw new Error('no plan yet');
  return profile.profile?.plan;
}
