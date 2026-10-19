import { useSearchParams } from 'react-router';
import { PaginationEnum } from '../constants/pagination';
import { getOrderedByColumn } from '../utils/pagination';
import { useCallback, useState } from 'react';
import { ANY } from '../constants/global';
import type { PaginatedValue } from '../types/pagination.types';

const DEFAULT_PAGE_SIZE = 4;
function usePagination(noParam?: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterObj, setFilterObj] = useState<
    Record<string, string | undefined>
  >({
    limit: String(DEFAULT_PAGE_SIZE),
  });
  const limit =
    searchParams.get(PaginationEnum.Limit) ?? String(DEFAULT_PAGE_SIZE);
  const orderBy = searchParams.get(PaginationEnum.OrderBy) ?? undefined;

  /* Stable across renders so callers can memoize on it — a search box debouncing against
     a handler that changes every render would lose its pending call. */
  const changeParams = useCallback(
    (key: PaginationEnum | string, value: PaginatedValue) => {
      let modifiedValue: PaginatedValue = value;
      if (value === ANY) {
        modifiedValue = undefined;
      } else {
        modifiedValue = String(value);
      }
      if (noParam) {
        if (key !== PaginationEnum.Page) {
          setFilterObj((prev) => ({
            ...prev,
            [key]: modifiedValue,
            [PaginationEnum.Page]: '1',
          }));
        } else {
          setFilterObj((prev) => ({ ...prev, [key]: modifiedValue }));
        }
      } else {
        if (key !== PaginationEnum.Page) {
          setSearchParams((prev) => {
            if (!modifiedValue) {
              prev.delete(key);
            } else {
              prev.set(key, modifiedValue);
            }
            prev.set(PaginationEnum.Page, String(1));

            return prev;
          });
        } else {
          setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (!modifiedValue) {
              newParams.delete(key);
            } else {
              newParams.set(key, modifiedValue);
          }
            return newParams;
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
    filterObj: noParam
      ? filterObj
      : noParam
        ? filterObj
        : {
            ...[...searchParams.entries()].reduce(
              (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
              {},
            ),
            limit,
          },
    changeParams,
    sortedColumns,
  };
}

export default usePagination;
