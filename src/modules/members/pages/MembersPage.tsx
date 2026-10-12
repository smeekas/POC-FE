import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { InvitedMembersTable } from '../components/InvitedMembersTable';
import { MembersTable } from '../components/MembersTable';

/** Lists everyone in the tenant, where an ADMIN invites people in. */
export const MembersPage = () => {
  return (
    <section>
      <PageHeader
        title='Members'
        description='Everyone in this workspace will be listed here.'
      />

      <MembersTable />

      <InvitedMembersTable />
    </section>
  );
};
