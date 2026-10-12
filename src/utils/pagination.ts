import type { SortMode } from '../components/common/DataTable/DataTable';

export function getOrderedByColumn(orderBy: string | undefined) {
  if (!orderBy) return {};
  const eachColumn = decodeURIComponent(orderBy).split(',');
  return eachColumn
    .filter(Boolean)
    .reduce<Record<string, SortMode>>((acc, colItem) => {
      const colDesc = colItem.split(':');
      if (colDesc.length !== 2) {
        return acc;
      }
      return {
        ...acc,
        [colDesc[0]]: colDesc[1] as SortMode,
      };
    }, {});
}
