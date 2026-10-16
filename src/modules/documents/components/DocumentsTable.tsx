import { Flex } from '@radix-ui/themes';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import DataTable from '../../../components/common/DataTable/DataTable';
import Pagination from '../../../components/ui/Pagination';
import SearchBar from '../../../components/ui/SearchBar';
import { PaginationEnum } from '../../../constants/pagination';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import usePagination from '../../../hooks/usePagination';
import { getDocumentColumns } from '../columns/documents.columns';
import useGetDocuments from '../hooks/useGetDocuments';
import { ActionButton } from '../../../components/ui/ActionButton';
import { usePlan } from '../../../hooks/usePlan';
import { LimitGuard } from '../../../guards/LimitGuard';

/**
 * The document list itself: owns its paging and sorting params, fetches against them and
 * draws the rows, so the page around it only has to place it.
 */
export const DocumentsTable = () => {
  const { changeParams, filterObj, sortedColumns } = usePagination();
  const { data, isLoading, isRefetching } = useGetDocuments(filterObj);
  const { tags } = usePlan();
  const documents = data?.data?.data || [];
  const metaData = data?.data?.meta;
  const navigate = useNavigate();
console.log(filterObj)
  /* The search box debounces against this, so it has to keep the same identity between
     renders. */
  const handleSearch = useCallback(
    (value: string) => changeParams(PaginationEnum.Search, value),
    [changeParams],
  );

  return (
    <>
      {/* Says why the create button below it is dead, so the two are read together. */}
      <LimitGuard feature='document' />

      {/* Search and the primary action share the row above the table, pushed to opposite
          edges so neither sits over the column the table reads down. */}
      <Flex justify='between' align='center' gap='3' mb='3'>
        <SearchBar
          defaultValue={filterObj.search}
          placeholder='Search documents…'
          onSearch={handleSearch}
        />

        <ActionButton
          feature='document'
          onClick={() => navigate(ROUTE_PATHS.CREATE_DOCUMENT)}
          role='link'
        >
          Create document
        </ActionButton>
      </Flex>

      <DataTable
        loading={isLoading || isRefetching}
        onSort={(key, value) =>
          changeParams(PaginationEnum.OrderBy, `${key}:${value}`)
        }
        columns={getDocumentColumns(sortedColumns, tags)}
        onRowClick={(doc) => navigate(ROUTE_PATHS.EDIT_DOCUMENT(doc.id))}
        row={documents}
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
