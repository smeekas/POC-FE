import DataTable from '../../../components/common/DataTable/DataTable';
import Pagination from '../../../components/ui/Pagination';
import { PaginationEnum } from '../../../constants/pagination';
import usePagination from '../../../hooks/usePagination';
import { getMemberColumns } from '../columns/members.columns';
import { useGetMembers } from '../hooks/useGetMembers';

/**
 * The member list itself: owns its paging and sorting params, fetches against them and
 * draws the rows, so the page around it only has to place it.
 */
export const MembersTable = () => {
  const { changeParams, filterObj, sortedColumns } = usePagination();
  const { data, isLoading, isRefetching } = useGetMembers(filterObj);
  const members = data?.data?.data || [];
  const metaData = data?.data?.meta;

  return (
    <>
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
