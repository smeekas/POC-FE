import TenantDetail from '../components/TenantDetail';
import useGetTenantDetail from '../hooks/useGetTenantDetail';
import Loading from '../../../components/common/Loading/Loading';
import { useGetTenant } from '../hooks/useGetTenant';

function TenantDetailPage() {
  const id = useGetTenant();
  const { data, isLoading } = useGetTenantDetail({ id });
  if (isLoading || !data) {
    return <Loading />;
  }
  return <TenantDetail data={data.data.data} />;
}

export default TenantDetailPage;
