import {
  ExclamationTriangleIcon,
  HomeIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import { SimpleGrid } from '@mantine/core';

import { StatCard } from '../../../components/ui/StatCard';
import { useGetOverview } from '../hooks/useGetOverview';

/** `2 of 3 tenants (67%)`, or nothing at all until the counts have arrived. */
const share = (part?: number, total?: number) => {
  if (part === undefined || !total) return undefined;

  return `${part} of ${total} tenants (${Math.round((part / total) * 100)}%)`;
};

/**
 * The platform wide counts that sit above the tenant table.
 *
 * The total stays neutral so the two counts that carry a verdict are the ones that catch
 * the eye, and `At limit` only turns red once there is something to be red about.
 */
export const TenantOverviewCards = () => {
  const { data } = useGetOverview();
  const overview = data?.data?.data;

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md' mb='lg'>
      <StatCard
        label='Tenants'
        value={overview?.tenantCount}
        hint='Workspaces on the platform'
        icon={<HomeIcon />}
      />

      <StatCard
        label='Paid tenants'
        value={overview?.paidTenants}
        hint={share(overview?.paidTenants, overview?.tenantCount)}
        icon={<RocketIcon />}
        color='green'
      />

      <StatCard
        label='At limit'
        value={overview?.atLimit}
        hint={
          overview?.atLimit
            ? share(overview.atLimit, overview.tenantCount)
            : 'All within plan limits'
        }
        icon={<ExclamationTriangleIcon />}
        color={overview?.atLimit ? 'red' : 'gray'}
      />
    </SimpleGrid>
  );
};

export default TenantOverviewCards;
