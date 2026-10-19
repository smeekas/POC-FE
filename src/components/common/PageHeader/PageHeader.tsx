import { Text, Title } from '@mantine/core';

import styles from './PageHeader.module.css';

export type PageHeaderProps = {
  title: string;
  description?: string;
};

/**
 * Title block every page opens with, so headings stay the same size and the same
 * distance from the content below them across the app.
 */
export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      <Title order={1} size='2xl'>
        {title}
      </Title>

      {description && (
        <Text component='p' size='sm' c='dimmed' className={styles.description}>
          {description}
        </Text>
      )}
    </header>
  );
};

export default PageHeader;
