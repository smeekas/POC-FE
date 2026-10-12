import { Badge, DropdownMenu, IconButton } from '@radix-ui/themes';
import dayjs from 'dayjs';

import type { DataTableColumn } from '../../../components/common/DataTable/DataTable';
import { MoreVerticalIcon } from '../../../components/icons';
import { DateFormats } from '../../../constants/dateFormats';
import { INVITATION_STATE_COLORS } from '../../../constants/invitationState';
import { ROLE_COLORS } from '../../../constants/role';
import type { InvitedMemberItem } from '../dto/invitedMembers.dto';

export type InvitedMemberActions = {
  onRevoke: (invite: InvitedMemberItem) => void;
  onResend: (invite: InvitedMemberItem) => void;
};

/** Columns of the invite list, with the row menu hanging off the last one. */
export const getInvitedMemberColumns = ({
  onRevoke,
  onResend,
}: InvitedMemberActions): DataTableColumn<InvitedMemberItem>[] => [
  {
    name: 'Email',
    identifier: 'email',
    render: (invite) => invite.email,
  },
  {
    name: 'Role',
    identifier: 'role',
    render: (invite) => (
      <Badge color={ROLE_COLORS[invite.role]}>{invite.role}</Badge>
    ),
  },
  {
    name: 'Status',
    identifier: 'status',
    render: (invite) => (
      <Badge color={INVITATION_STATE_COLORS[invite.status]}>
        {invite.status}
      </Badge>
    ),
  },
  {
    name: 'Sent',
    identifier: 'updated_at',
    render: (invite) =>
      dayjs(invite.sent_at).format(DateFormats.INVITATION_SENT),
  },
  {
    name: '',
    identifier: 'id',
    render: (invite) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            variant='ghost'
            color='gray'
            aria-label={`Actions for ${invite.email}`}
          >
            <MoreVerticalIcon />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant='soft'>
          <DropdownMenu.Item onSelect={() => onResend(invite)}>
            Resend
          </DropdownMenu.Item>
          <DropdownMenu.Item color='red' onSelect={() => onRevoke(invite)}>
            Revoke
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ),
  },
];
