import { useSearchParams } from 'react-router';
import { PaginationEnum } from '../constants/pagination';
import { getOrderedByColumn } from '../utils/pagination';
import { useCallback, useState } from 'react';

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

  /* Stable across renders so callers can memoize on it — a search box debouncing against
     a handler that changes every render would lose its pending call. */
  const changeParams = useCallback(
    (key: PaginationEnum, value: string | number) => {
      if (noParam) {
        if (key === PaginationEnum.Search) {
          setFilterObj((prev) => ({
            ...prev,
            [key]: String(value),
            [PaginationEnum.Page]: '1',
          }));
        } else {
          setFilterObj((prev) => ({ ...prev, [key]: String(value) }));
        }
      } else {
        if (key === PaginationEnum.Search) {
          setSearchParams((prev) => {
            prev.set(key, String(value));
            prev.set(PaginationEnum.Page, String(1));

            return prev;
          });
        } else {
          setSearchParams((prev) => {
            prev.set(key, String(value));
            return prev;
          });
        }
      }
    },
    [noParam, setSearchParams],
  );
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
