export enum InvitationState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

/**
 * Badge colour per invitation state: taken up, still waiting, or gone nowhere.
 */
export const INVITATION_STATE_COLORS = {
  [InvitationState.ACCEPTED]: 'green',
  [InvitationState.PENDING]: 'yellow',
  [InvitationState.EXPIRED]: 'gray',
  [InvitationState.REVOKED]: 'red',
} as const;
