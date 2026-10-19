import { Group } from '@mantine/core';
import { useCallback } from 'react';

import DataTable from '../../../components/common/DataTable/DataTable';
import Pagination from '../../../components/ui/Pagination';
import SearchBar from '../../../components/ui/SearchBar';
import { PaginationEnum } from '../../../constants/pagination';
import usePagination from '../../../hooks/usePagination';
import { getMemberColumns } from '../columns/members.columns';
import { useGetMembers } from '../hooks/useGetMembers';
import { LimitGuard } from '../../../guards/LimitGuard';

/**
 * The member list itself: owns its paging and sorting params, fetches against them and
 * draws the rows, so the page around it only has to place it.
 */
export const MembersTable = () => {
  const { changeParams, filterObj, sortedColumns } = usePagination();
  const { data, isLoading, isRefetching } = useGetMembers(filterObj);
  const members = data?.data?.data || [];
  const metaData = data?.data?.meta;

  /* The search box debounces against this, so it has to keep the same identity between
     renders. */
  const handleSearch = useCallback(
    (value: string) => changeParams(PaginationEnum.Search, value),
    [changeParams],
  );

  return (
    <>
      {/* Sits at the top of the page rather than beside the invite button further down:
          a full workspace is the first thing to say about the member list. */}
      <LimitGuard feature='user' />

      <Group mb='sm'>
        <SearchBar
          defaultValue={filterObj.search}
          placeholder='Search members…'
          onSearch={handleSearch}
        />
      </Group>

      <DataTable
        loading={isLoading || isRefetching}
        onSort={(key, value) =>
          changeParams(PaginationEnum.OrderBy, `${key}:${value}`)
        }
        columns={getMemberColumns(sortedColumns)}
        row={members}
      />

      {metaData && (
        <Pagination
          total={metaData?.total}
          page={metaData?.page}
          size={metaData?.size}
          onPageChange={(value) => {
            changeParams(PaginationEnum.Page, value);
          }}
        />
      )}
    </>
  );
};
