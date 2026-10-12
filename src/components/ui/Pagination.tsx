import { Button, Flex, IconButton, Text } from '@radix-ui/themes';

import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

import styles from './Pagination.module.css';

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

/** Pages either side of the current one that are always drawn as numbers. */
const SIBLING_COUNT = 1;

/** A gap stands in for the pages that were collapsed away. */
type PageItem = number | 'gap';

/**
 * Builds the row of page numbers: the first and last page are always reachable, the
 * current page keeps a sibling on each side, and everything between collapses to a gap.
 */
const buildPageItems = (page: number, pageCount: number): PageItem[] => {
  /* Below this there is nothing to collapse, so every page gets its own button. */
  const maxVisible = SIBLING_COUNT * 2 + 5;
  if (pageCount <= maxVisible) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const windowStart = Math.max(page - SIBLING_COUNT, 2);
  const windowEnd = Math.min(page + SIBLING_COUNT, pageCount - 1);

  const items: PageItem[] = [1];

  if (windowStart > 2) items.push('gap');

  for (let current = windowStart; current <= windowEnd; current += 1) {
    items.push(current);
  }

  if (windowEnd < pageCount - 1) items.push('gap');

  items.push(pageCount);
  return items;
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

  const goTo = (next: number) => {
    if (next === currentPage || next < 1 || next > pageCount) return;
    onPageChange(next);
  };

  return (
    <Flex
      asChild
      align='center'
      justify='between'
      gap='3'
      wrap='wrap'
      mt='4'
    >
      <nav aria-label='Pagination'>
        <Text size='1' color='gray'>
          {firstRow}–{lastRow} of {total}
        </Text>

        <Flex align='center' gap='1'>
          <IconButton
            variant='soft'
            color='gray'
            aria-label='Previous page'
            disabled={disabled || currentPage === 1}
            onClick={() => goTo(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </IconButton>

          {buildPageItems(currentPage, pageCount).map((item, index) =>
            item === 'gap' ? (
              <Text
                key={`gap-${index}`}
                size='2'
                color='gray'
                className={styles.gap}
                aria-hidden
              >
                …
              </Text>
            ) : (
              <Button
                key={item}
                variant={item === currentPage ? 'solid' : 'soft'}
                color={item === currentPage ? undefined : 'gray'}
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                disabled={disabled}
                onClick={() => goTo(item)}
              >
                {item}
              </Button>
            ),
          )}

          <IconButton
            variant='soft'
            color='gray'
            aria-label='Next page'
            disabled={disabled || currentPage === pageCount}
            onClick={() => goTo(currentPage + 1)}
          >
            <ChevronRightIcon />
          </IconButton>
        </Flex>
      </nav>
    </Flex>
  );
};

export default Pagination;
