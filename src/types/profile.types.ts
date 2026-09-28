import type { UserRole } from '../constants/role';

export type ProfileRes = {
  id: number;
  role: UserRole;
  email: string;
};
