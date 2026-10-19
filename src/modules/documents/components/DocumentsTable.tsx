import { Group } from '@mantine/core';
import { useNavigate } from 'react-router';

import DataTable from '../../../components/common/DataTable/DataTable';
import Pagination from '../../../components/ui/Pagination';
import { PaginationEnum } from '../../../constants/pagination';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import usePagination from '../../../hooks/usePagination';
import { getDocumentColumns } from '../columns/documents.columns';
import useGetDocuments from '../hooks/useGetDocuments';
import { ActionButton } from '../../../components/ui/ActionButton';
import { LimitGuard } from '../../../guards/LimitGuard';
import { usePlan } from '../../../hooks/usePlan';
import DocumentFilters from './DocumentFilters';

/**
 * The document list itself: owns its paging and sorting params, fetches against them and
 * draws the rows, so the page around it only has to place it.
 */
export const DocumentsTable = () => {
  const { changeParams, filterObj, sortedColumns } = usePagination();
  const { data, isLoading, isRefetching } = useGetDocuments(filterObj);
  const documents = data?.data?.data || [];
  const metaData = data?.data?.meta;
  const { tags } = usePlan();
  const navigate = useNavigate();
  return (
    <>
      <LimitGuard feature='document' />
      {/* Pushed to the right edge: the primary action sits opposite the page title,
          clear of the column the table reads down. */}
      <Group justify='space-between' mb='sm'>
        <DocumentFilters onChangeParams={changeParams} />

        {/* created by email filter */}
        {/* t ag filter */}
        <ActionButton
          feature='document'
          onClick={() => navigate(ROUTE_PATHS.CREATE_DOCUMENT)}
          role='link'
        >
          Create document
        </ActionButton>
      </Group>

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
