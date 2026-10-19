import { Badge } from '@mantine/core';
import dayjs from 'dayjs';

import type {
  DataTableColumn,
  SortMode,
} from '../../../components/common/DataTable/DataTable';
import { DateFormats } from '../../../constants/dateFormats';
import { ROLE_COLORS } from '../../../constants/role';
import type { MemberItem } from '../dto/members.dto';

/**
 * Columns of the member list.
 *
 * Built per render rather than held as a constant because `defaultSort` has to reflect
 * the sort currently in the URL, which only the caller knows.
 */
export const getMemberColumns = (
  sortedColumns: Record<string, SortMode>,
): DataTableColumn<MemberItem>[] => [
  {
    name: 'Email',
    identifier: 'email',
    sort: true,
    defaultSort: sortedColumns['email'],
    render: (member) => member.email,
  },
  {
    name: 'Role',
    identifier: 'role',
    sort: true,
    defaultSort: sortedColumns['role'],
    render: (member) => (
      <Badge color={ROLE_COLORS[member.role]}>{member.role}</Badge>
    ),
  },
  {
    name: 'Joined',
    identifier: 'created_at',
    sort: true,
    defaultSort: sortedColumns['created_at'],
    render: (member) =>
      dayjs(member.created_at).format(DateFormats.DATE_MONTH_YEAR),
  },
];
