import DataTable from '../../../components/common/DataTable/DataTable';
import { getUsageColumns } from '../columns/usage.columns';
import { useGetUsage } from '../hooks/useGetUsage';

/**
 * Every tenant and what it is consuming.
 *
 * The endpoint returns the whole list in one response, so unlike the member and document
 * tables there is nothing to page through here.
 */
export const TenantUsageTable = () => {
  const { data, isLoading, isRefetching } = useGetUsage();
  const usage = data?.data?.data || [];

  return (
    <DataTable
      loading={isLoading || isRefetching}
      columns={getUsageColumns()}
      row={usage}
    />
  );
};

export default TenantUsageTable;
