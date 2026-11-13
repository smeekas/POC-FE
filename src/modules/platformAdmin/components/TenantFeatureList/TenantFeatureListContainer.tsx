import Loading from '../../../../components/common/Loading/Loading';
import { useGetTenant } from '../../hooks/useGetTenant';
import { useGetTenantFeatures } from '../../hooks/useGetTenantFeatures';
import TenantFeatureList from './TenantFeatureList';

function TenantFeatureListContainer() {
  const id = useGetTenant();
  const { data, isLoading } = useGetTenantFeatures(id);
  if (isLoading) {
    return <Loading />;
  }
  if (data?.data?.data) {
    return <TenantFeatureList data={data.data.data} />;
  }
  return <p>error</p>;
}

export default TenantFeatureListContainer;
