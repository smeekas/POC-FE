import dayjs from 'dayjs';

import type {
  DataTableColumn,
  SortMode,
} from '../../../components/common/DataTable/DataTable';
import { DateFormats } from '../../../constants/dateFormats';
import { UserRole } from '../../../constants/role';
import type { MemberItem } from '../dto/members.dto';
import CustomSelect from '../../../components/ui/Select/CustomSelect';
import styles from '../components/memberTable.module.css';
/**
 * Columns of the member list.
 *
 * Built per render rather than held as a constant because `defaultSort` has to reflect
 * the sort currently in the URL, which only the caller knows.
 */
export const getMemberColumns = (
  sortedColumns: Record<string, SortMode>,
  options: {
    currentUser?: number;
    onRoleChange: (id: number, role: UserRole) => void;
  },
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
    render: (member) => {
      return (
        <CustomSelect
          width={'100'}
          defaultValue={member.role}
          disabled={member.id === options.currentUser}
          size='sm'
          onChange={(value) => options.onRoleChange(member.id, value!)}
          classNames={{ root: styles.root }}
          data={[
            {
              label: UserRole.MEMBER,
              value: UserRole.MEMBER,
            },
            {
              label: UserRole.ADMIN,
              value: UserRole.ADMIN,
            },
          ]}
        />
      );
    },
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
