import { Button, Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router';

import DataTable from '../../../components/common/DataTable/DataTable';
import Pagination from '../../../components/ui/Pagination';
import { PaginationEnum } from '../../../constants/pagination';
import { ROUTE_PATHS } from '../../../constants/routePaths';
import usePagination from '../../../hooks/usePagination';
import { getDocumentColumns } from '../columns/documents.columns';
import useGetDocuments from '../hooks/useGetDocuments';

/**
 * The document list itself: owns its paging and sorting params, fetches against them and
 * draws the rows, so the page around it only has to place it.
 */
export const DocumentsTable = () => {
  const { changeParams, filterObj, sortedColumns } = usePagination();
  const { data, isLoading, isRefetching } = useGetDocuments(filterObj);
  const documents = data?.data?.data || [];
  const metaData = data?.data?.meta;
  const navigate = useNavigate();
  return (
    <>
      {/* Pushed to the right edge: the primary action sits opposite the page title,
          clear of the column the table reads down. */}
      <Flex justify='end' mb='3'>
        <Button
          onClick={() => navigate(ROUTE_PATHS.CREATE_DOCUMENT)}
          role='link'
        >
          Create document
        </Button>
      </Flex>

      <DataTable
        loading={isLoading || isRefetching}
        onSort={(key, value) =>
          changeParams(PaginationEnum.OrderBy, `${key}:${value}`)
        }
        columns={getDocumentColumns(sortedColumns)}
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
