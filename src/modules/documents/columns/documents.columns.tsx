import { Badge, Flex } from '@radix-ui/themes';

import type {
  DataTableColumn,
  SortMode,
} from '../../../components/common/DataTable/DataTable';
import type { DocumentItem } from '../dto/documents.dto';

const EMPTY_VALUE = '—';

/**
 * Columns of the document list.
 *
 * Built per render rather than held as a constant because `defaultSort` has to reflect
 * the sort currently in the URL, which only the caller knows.
 *
 * Owner and tags read out of nested values, so they are named by the key they hang off
 * (`user`, `tags`) and left unsortable: there is no single scalar field behind them for
 * the API to order on.
 */
export const getDocumentColumns = (
  sortedColumns: Record<string, SortMode>,
  hasTags?: boolean,
): DataTableColumn<DocumentItem>[] => {
  const columns: DataTableColumn<DocumentItem>[] = [
    {
      name: 'Title',
      identifier: 'title',
      sort: true,
      defaultSort: sortedColumns['title'],
      render: (document) => document.title,
    },

    {
      name: 'Owner',
      identifier: 'email',
      sort: true,
      render: (document) => document.user?.email || EMPTY_VALUE,
    },
  ];
  if (hasTags) {
    columns.push({
      name: 'Tags',
      identifier: 'tags',
      sort: true,
      render: (document) =>
        document.tags?.length ? (
          <Flex gap='1' wrap='wrap'>
            {/* Outlined rather than filled: a soft grey chip is the same wash as the row
              hover, so the tag disappeared under the cursor. A border holds its shape
              against whatever the row is doing. */}
            {document.tags.map((tag) => (
              <Badge key={tag} color='gray' variant='outline' highContrast>
                {tag}
              </Badge>
            ))}
          </Flex>
        ) : (
          EMPTY_VALUE
        ),
    });
  }
  return columns;
};
