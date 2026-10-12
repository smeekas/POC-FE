import { useSearchParams } from 'react-router';
import { PaginationEnum } from '../constants/pagination';
import { getOrderedByColumn } from '../utils/pagination';
import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 4;
function usePagination(noParam?: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterObj, setFilterObj] = useState<Record<string, string>>({
    limit: String(DEFAULT_PAGE_SIZE),
  });
  const page = searchParams.get(PaginationEnum.Page) ?? undefined;
  const limit =
    searchParams.get(PaginationEnum.Limit) ?? String(DEFAULT_PAGE_SIZE);
  const search = searchParams.get(PaginationEnum.Search) ?? undefined;
  const orderBy = searchParams.get(PaginationEnum.OrderBy) ?? undefined;

  const changeParams = (key: PaginationEnum, value: string | number) => {
    if (noParam) {
      setFilterObj((prev) => ({ ...prev, [key]: String(value) }));
    } else {
      setSearchParams((prev) => {
        prev.set(key, String(value));
        return prev;
      });
    }
  };
  const sortedColumns = getOrderedByColumn(
    noParam ? filterObj['orderBy'] || '' : orderBy,
  );
  return {
    filterObj: noParam ? filterObj : { page, limit, search, orderBy },
    changeParams,
    sortedColumns,
  };
}

export default usePagination;
