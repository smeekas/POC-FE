import { Table } from '@mantine/core';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { SortAscIcon, SortDescIcon, SortIcon } from '../../icons';
import styles from './DataTable.module.css';

export type SortMode = 'asc' | 'desc';

/**
 * A column either sorts through the parent (`onSort`) or sorts the rows it was given
 * (`sorter`), never both: the first is for server or parent owned ordering, the second
 * for a list the table already holds in full. A column with neither is not sortable.
 */
export type DataTableColumn<K extends Record<string, unknown>> = {
  name: string;
  render: (
    ke: K,
    options: { toggleExpand: () => void; isExpanded: () => boolean },
  ) => ReactNode;
  defaultSort?: SortMode;
  identifier: string;
} & (
  | {
      sort: true;
      sorter?: never;
    }
  | {
      sorter: (a: K, b: K) => boolean;
      sort?: never;
    }
  /* A display only column, an actions menu say, has no field behind it to name. */
  | { sort?: never; sorter?: never }
);

type DataTableProps<K extends Record<string, unknown>> = {
  columns: DataTableColumn<K>[];
  /** Makes the whole row a target. Omit it and rows stay inert. */
  onRowClick?: (data: K) => void;
  row: K[];
  onSort?: (identifier: string, mode: string) => void;
  loading?: boolean;
  expandRowRender?: (props: { feature: K }) => ReactNode;
  defaultRowExpanded?: (feature: K) => boolean;
};

type SortState = Record<string, SortMode>;

const sortIcons = { asc: SortAscIcon, desc: SortDescIcon };

/**
 * Renders rows against the column definitions it is given: each column owns its own
 * header name and its own `render`, so the table stays agnostic of what a row holds.
 */
function DataTable<T extends Record<string, unknown>>({
  columns,
  row,
  onSort,
  loading,
  onRowClick,
  expandRowRender,
  defaultRowExpanded,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(() => {
    return columns.reduce((acc, column) => {
      if (column.defaultSort && (column.sorter ?? column.sort)) {
        return { ...acc, [column.name]: column.defaultSort };
      } else return acc;
    }, {});
  });
  /* Only `sorter` columns reorder here. An `onSort` column has handed ordering to the
     parent, so its rows arrive in the order they should be drawn. */
  const sortedRows = useMemo(() => {
    const sorters = columns
      .filter((column) => column.sorter && sort[column.name])
      .map((columnItem) => ({
        sorter: columnItem.sorter,
        mode: sort[columnItem.name],
      }));
    if (sorters.length === 0) return row;
    return sorters.reduce((acc, curr) => {
      if (curr.mode === 'asc') {
        return acc.toSorted((a, b) => (curr.sorter?.(a, b) ? -1 : 1));
      }
      return acc.toSorted((a, b) => (curr.sorter?.(a, b) ? 1 : -1));
    }, row);
  }, [columns, row, sort]);
  const [expandedRow, setExpandedRow] = useState<Set<number>>(() => {
    const set = new Set<number>();
    sortedRows.forEach((rowItem, index) => {
      if (defaultRowExpanded && defaultRowExpanded(rowItem)) {
        set.add(index);
      }
    });
    return set;
  });

  const expandRow = useCallback((name: number) => {
    setExpandedRow((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  }, []);
  const handleSort = (column: DataTableColumn<T>) => {
    const mode: SortMode = sort[column.name] === 'asc' ? 'desc' : 'asc';

    setSort(() => ({ [column.name]: mode }));
    // set sort local
    // and inform via callback so Data can be fetched
    onSort?.(column.identifier, mode);
  };

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <Table.Tr>
          <Table.Td className={styles.center} colSpan={columns.length}>
            Loading...
          </Table.Td>
        </Table.Tr>
      );
    }
    if (sortedRows.length === 0) {
      return (
        <Table.Tr>
          <Table.Td className={styles.center} colSpan={columns.length}>
            No record.
          </Table.Td>
        </Table.Tr>
      );
    }
    /* A clickable row is a control, so it takes focus and answers Enter the way a link
       would. Without `onRowClick` it stays plain markup. */
    return sortedRows.map((item, rowIndex) => (
      <>
        <Table.Tr
          key={rowIndex}
          className={onRowClick ? styles.clickableRow : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          onClick={() => onRowClick?.(item)}
          styles={
            expandedRow.has(rowIndex) ? { tr: { borderBottom: 'none' } } : {}
          }
          onKeyDown={(event) => {
            if (onRowClick && event.key === 'Enter') onRowClick(item);
          }}
        >
          {columns.map((column) => (
            <Table.Td key={column.name}>
              {column.render(item, {
                toggleExpand: () => expandRow(rowIndex),
                isExpanded: () => expandedRow.has(rowIndex),
              })}
            </Table.Td>
          ))}
        </Table.Tr>
        {}
        {expandedRow.has(rowIndex) && (
          <Table.Tr>
            <Table.Td colSpan={columns.length}>
              {expandRowRender?.({ feature: item })}
            </Table.Td>
          </Table.Tr>
        )}
      </>
    ));
  }, [
    loading,
    sortedRows,
    onRowClick,
    columns,
    expandRowRender,
    expandedRow,
    expandRow,
  ]);

  return (
    <Table
      withTableBorder
      withColumnBorders={false}
      highlightOnHover={Boolean(onRowClick)}
      className={styles.table}
    >
      <Table.Thead>
        <Table.Tr>
          {columns.map((column) => {
            const isSortable = Boolean(column.sorter ?? column.sort);
            const activeMode = sort[column.name] ? sort[column.name] : null;
            const Icon = activeMode ? sortIcons[activeMode] : SortIcon;

            return (
              <Table.Th
                key={column.name}
                className={styles.header}
                aria-sort={
                  activeMode
                    ? activeMode === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {isSortable ? (
                  <button
                    type='button'
                    className={styles.sortButton}
                    onClick={() => handleSort(column)}
                  >
                    {column.name}
                    <Icon
                      className={activeMode ? styles.active : styles.inactive}
                    />
                  </button>
                ) : (
                  column.name
                )}
              </Table.Th>
            );
          })}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{tableBody}</Table.Tbody>
    </Table>
  );
}

export default DataTable;
