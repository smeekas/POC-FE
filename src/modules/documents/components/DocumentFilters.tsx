import { Flex } from '@mantine/core';

import SearchBar from '../../../components/ui/SearchBar';
import { PaginationEnum } from '../../../constants/pagination';
import { useUserList } from '../hooks/useUserList';
import CustomSelect from '../../../components/ui/Select/CustomSelect';
import CustomMultiSelect from '../../../components/ui/Select/CustomMultiSelect';
import useTags from '../hooks/useTags';
import { useEffect, useMemo, useState } from 'react';
import { ANY } from '../../../constants/global';
import type { PaginatedValue } from '../../../types/pagination.types';
import { usePrevValue } from '../../../hooks/usePrevValue';

type DocumentFiltersProps = {
  onChangeParams: (key: PaginationEnum | string, value: PaginatedValue) => void;
  filters: Record<string, string | undefined>;
};
function DocumentFilters({ onChangeParams, filters }: DocumentFiltersProps) {
  const { data, isLoading } = useUserList();
  const { data: tagData, isLoading: isTagLoading } = useTags();
  /* Held here rather than left uncontrolled because the `+N` pill has to know where
     each selection sits in the list to decide which pills collapse. */

  const [tags, setTags] = useState<string[]>([]);
  const prev = usePrevValue(tags);

  useEffect(() => {
    if (tags.length < prev.length) {
      onChangeParams('tags', tags.join(','));
    }
  }, [prev, tags, onChangeParams]);
  const options = useMemo(() => {
    let op = [];
    op =
      data?.data.data.map<{ label: string; value: string | number }>(
        (dataItem) => ({
          label: dataItem.email,
          value: dataItem.id,
        }),
      ) || [];
    op.unshift({ label: 'Any Users', value: ANY });
    return op;
  }, [data]);
  const selectedByUser = options.find(
    (optionItem) => String(optionItem.value) === filters['by_user'],
  );
  const tagOptions = useMemo(
    () =>
      tagData?.data.data.map((dataItem) => ({
        label: dataItem,
        value: dataItem,
      })) || [],
    [tagData],
  );
  return (
    <Flex gap={4}>
      <SearchBar
        onSearch={(value) => onChangeParams(PaginationEnum.Search, value)}
      />
      <CustomSelect<string | number>
        placeholder=' by user'
        loading={isLoading}
        value={selectedByUser?.value || ANY}
        data={options}
        onChange={(v) => onChangeParams('by_user', v || ANY)}
        searchable
        size='sm'
      />
      <CustomMultiSelect
        placeholder='tags'
        loading={isTagLoading}
        data={tagOptions}
        onBlur={() => onChangeParams('tags', tags.join(','))}
        size='sm'
        searchable
        w={550}
        value={tags}
        onChange={setTags}
      />
    </Flex>
  );
}

export default DocumentFilters;
