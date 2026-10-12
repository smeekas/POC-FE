import type { InvitationState } from '../../../constants/invitationState';
import type { UserRole } from '../../../constants/role';
import type { APIResponse } from '../../../types/common.types';

export type InvitedMemberItem = {
  email: string;
  id: number;
  role: UserRole;
  status: InvitationState;
  created_at: string;
  updated_at: string;
  sent_at: string;
};

export type InvitedMemberResponse = APIResponse<InvitedMemberItem[]>;

export type InviteMemberRequest = {
  email: string;
  role: UserRole;
};
export enum InviteMemberUpdateEnum {
  Revoke = 'revoke',
  Resend = 'resend',
}
