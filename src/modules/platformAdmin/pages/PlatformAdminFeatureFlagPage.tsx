import DataTable from '../../../components/common/DataTable/DataTable';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import { featuresColumn } from '../columns/features.column';
import { useGetFeatures } from '../hooks/useGetFeatures';

function PlatformAdminFeatureFlagPage() {
  const { data } = useGetFeatures();
  return (
    <>
      <PageHeader
        title='Feature Flags'
        description='manage platform features'
      />
      <DataTable columns={featuresColumn} row={data?.data.data || []}  />
    </>
  );
}

export default PlatformAdminFeatureFlagPage;
