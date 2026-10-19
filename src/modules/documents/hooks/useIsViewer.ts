import { UserRole } from '../../../constants/role';
import { useTenantUser } from '../../../hooks/useTenantUser';

export function useIsViewer(createdBy?: number) {
  const { profile } = useTenantUser();
  const isDisabled =
    profile.role === UserRole.ADMIN ? false : profile.id !== createdBy;

  return isDisabled;
}
