import { type ReactNode } from 'react';
import { useProfile } from '../context/ProfileContext';

type PlatformAdminGuardProps = {
  children: ReactNode;
};
function PlatformAdminGuard({ children }: PlatformAdminGuardProps) {
  const { profile } = useProfile();
  const hasAccess =
    profile && 'isPlatformAdmin' in profile ? profile.isPlatformAdmin : false;
  if (hasAccess) return children;
  return null;
}

export default PlatformAdminGuard;
