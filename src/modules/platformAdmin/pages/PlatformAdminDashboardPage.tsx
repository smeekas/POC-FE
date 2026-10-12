import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { TenantOverviewCards } from '../components/TenantOverviewCards';
import { TenantUsageTable } from '../components/TenantUsageTable';

/** What every tenant on the platform is using against the plan it is on. */
export const PlatformAdminDashboardPage = () => {
  return (
    <section>
      <PageHeader
        title='Dashboard'
        description='Document and user usage for every tenant on the platform.'
      />

      <TenantOverviewCards />

      <TenantUsageTable />
    </section>
  );
};

export default PlatformAdminDashboardPage;
