import { useTenantUser } from './useTenantUser';

export function usePlan() {
  const profile = useTenantUser();
  if (!profile.profile?.plan) throw new Error('no plan yet');
  return profile.profile?.plan;
}
