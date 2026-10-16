import type { UserRole } from '../constants/role';

export type ProfileRes = {
  id?: number;
  role?: UserRole;
  email: string;
  require_onboarding: boolean;
  plan?: {
    id: number;
    name: string;
    tags: boolean;
    price: number;
    is_free: boolean;
    max_user: number;
    max_documents: number;
    documentLimitReached: boolean;
    userLimitReached: boolean;
  };
  tenant?: {
    name: string;
  };
};
export type PlatformAdminRes = {
  id: number;
  email: string;
  isPlatformAdmin: boolean;
};
