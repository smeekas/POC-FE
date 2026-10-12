import { PageHeader } from '../../../components/common/PageHeader/PageHeader';
import { DocumentsTable } from '../components/DocumentsTable';

/** The document list a tenant works out of. */
export const DocumentsPage = () => {
  return (
    <section>
      <PageHeader
        title='Documents'
        description='Documents will be listed here.'
      />
      <DocumentsTable />
    </section>
  );
};
