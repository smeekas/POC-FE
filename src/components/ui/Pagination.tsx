import { Group, Pagination as MantinePagination, Text } from '@mantine/core';

export type PaginationProps = {
  /** Current page, 1 based, matching `meta.page` on a paginated response. */
  page: number;
  /** Rows per page, matching `meta.size`. */
  size: number;
  /** Rows across every page, matching `meta.total`. */
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

/**
 * Page switcher for a list backed by `PaginatedAPIResponse`: a range summary on the
 * left, the page buttons on the right.
 *
 * It holds no state. The page owns which page is showing, since that is what the
 * query is keyed on. A single page of results renders nothing.
 */
export const Pagination = ({
  page,
  size,
  total,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const pageCount = size > 0 ? Math.ceil(total / size) : 0;
  if (pageCount <= 1) return null;

  /* Guards against a stale page left over from a filter that shrank the result set. */
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const firstRow = (currentPage - 1) * size + 1;
  const lastRow = Math.min(currentPage * size, total);

  return (
    <Group
      component='nav'
      aria-label='Pagination'
      align='center'
      justify='space-between'
      gap='sm'
      wrap='wrap'
      mt='md'
    >
      <Text size='xs' c='dimmed'>
        {firstRow}–{lastRow} of {total}
      </Text>

      <MantinePagination
        total={pageCount}
        value={currentPage}
        onChange={onPageChange}
        disabled={disabled}
        siblings={1}
        getItemProps={(itemPage) => ({ 'aria-label': `Page ${itemPage}` })}
        getControlProps={(control) => ({
          'aria-label': control === 'next' ? 'Next page' : 'Previous page',
        })}
      />
    </Group>
  );
};

export default Pagination;
