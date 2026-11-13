import type { DataTableColumn } from '../../../components/common/DataTable/DataTable';
import type { FeatureItem } from '../dto/feature.dto';

export const featuresColumn: DataTableColumn<FeatureItem>[] = [
  {
    identifier: 'feature_name',
    name: 'Feature name',
    render(ke) {
      return (
        <>
          <p className='bold'>{ke.feature_name}</p>
          <p>{ke.feature_key}</p>
        </>
      );
    },
  },
  {
    identifier: 'description',
    name: 'Feature description',
    render(ke) {
      return ke.description;
    },
  },
  {
    identifier: 'feature_type',
    name: 'Feature type',
    render(ke) {
      return ke.feature_type;
    },
  },
];
