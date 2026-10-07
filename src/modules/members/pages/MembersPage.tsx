import { Badge } from '@radix-ui/themes';

import DataTable from '../../../components/common/DataTable/DataTable';

/** Stand in rows until `useGetMembers` is wired into this page. */
const DUMMY_MEMBERS = [
  { name: 'Smeet Kakadiya', email: 'smeet.k@example.com', role: 'ADMIN' },
  { name: 'Aarti Patel', email: 'aarti.p@example.com', role: 'MEMBER' },
  { name: 'Dev Shah', email: 'dev.s@example.com', role: 'MEMBER' },
];

/** Placeholder for the member list, where an ADMIN invites people into the tenant. */
export const MembersPage = () => {
  return (
    <section>
      <h1>Members</h1>
      <p>Everyone in this workspace will be listed here.</p>

      <DataTable
        columns={[
          {
            name: 'Name',
            identifier: 'name',
            sort: true,
            render: (member) => member.name,
          },
          {
            name: 'Email',
            identifier: 'email',
            sort: true,
            render: (member) => member.email,
          },
          {
            name: 'Role',
            identifier: 'role',
            sort: true,
            render: (member) => (
              <Badge color={member.role === 'ADMIN' ? 'purple' : 'gray'}>
                {member.role}
              </Badge>
            ),
          },
        ]}
        row={DUMMY_MEMBERS}
      />
    </section>
  );
};
