import { Select } from '@mantine/core';

import SearchBar from '../../../components/ui/SearchBar';
import { PaginationEnum } from '../../../constants/pagination';

type DocumentFiltersProps = {
  onChangeParams: (key: PaginationEnum, value: string | number) => void;
};
function DocumentFilters({ onChangeParams }: DocumentFiltersProps) {
  return (
    <>
      <SearchBar
        onSearch={(value) => onChangeParams(PaginationEnum.Search, value)}
      />
      <Select data={[{ label: 'a', value: 'a' }]} />
    </>
  );
}

export default DocumentFilters;
