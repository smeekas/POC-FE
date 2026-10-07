import { Table } from '@radix-ui/themes';
import { useMemo, useState, type ReactNode } from 'react';

import { SortAscIcon, SortDescIcon, SortIcon } from '../../icons';
import styles from './DataTable.module.css';

export type SortMode = 'asc' | 'desc';

/**
 * A column either sorts through the parent (`onSort`) or sorts the rows it was given
 * (`sorter`), never both: the first is for server or parent owned ordering, the second
 * for a list the table already holds in full. A column with neither is not sortable.
 */
type DataTableProps<K extends Record<string, unknown>> = {
  columns: ({
    name: string;
    render: (ke: K) => ReactNode;
    identifier: string;
    defaultSort?: SortMode;
  } & (
    | {
        sort: true;
        sorter?: never;
      }
    | { sorter: (a: K, b: K) => boolean; sort?: never }
    | { sort?: never; sorter?: never }
  ))[];
  row: K[];
  onSort?: (identifier: string, mode: string) => void;
};

type SortState = { name: string; mode: SortMode };

const sortIcons = { asc: SortAscIcon, desc: SortDescIcon };

/**
 * Renders rows against the column definitions it is given: each column owns its own
 * header name and its own `render`, so the table stays agnostic of what a row holds.
 */
function DataTable<T extends Record<string, unknown>>({
  columns,
  row,
  onSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(() => {
    const preSorted = columns.find(
      (column) => column.defaultSort && (column.sorter ?? column.sort),
    );

    return preSorted
      ? { name: preSorted.name, mode: preSorted.defaultSort! }
      : null;
  });

  /* Only `sorter` columns reorder here. An `onSort` column has handed ordering to the
     parent, so its rows arrive in the order they should be drawn. */
  const sortedRows = useMemo(() => {
    const sorter = columns.find((column) => column.name === sort?.name)?.sorter;
    if (!sort || !sorter) return row;

    const ordered = [...row].sort((a, b) => (sorter(a, b) ? -1 : 1));
    return sort.mode === 'asc' ? ordered : ordered.reverse();
  }, [columns, row, sort]);

  const handleSort = (column: DataTableProps<T>['columns'][number]) => {
    const mode: SortMode =
      sort?.name === column.name && sort.mode === 'asc' ? 'desc' : 'asc';

    setSort({ name: column.name, mode });
    // set sort local
    // and inform via callback so Data can be fetched
    onSort?.(column.identifier, mode);
  };

  return (
    <Table.Root variant='surface'>
      <Table.Header>
        <Table.Row>
          {columns.map((column) => {
            const isSortable = Boolean(column.sorter ?? column.sort);
            const activeMode = sort?.name === column.name ? sort.mode : null;
            const Icon = activeMode ? sortIcons[activeMode] : SortIcon;

            return (
              <Table.ColumnHeaderCell
                key={column.name}
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
              </Table.ColumnHeaderCell>
            );
          })}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {sortedRows.map((item, rowIndex) => (
          <Table.Row key={rowIndex}>
            {columns.map((column) => (
              <Table.Cell key={column.name}>{column.render(item)}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default DataTable;
