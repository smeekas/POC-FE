import { Heading, Text } from '@radix-ui/themes';

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
      <Heading as='h1' size='6' trim='start'>
        {title}
      </Heading>

      {description && (
        <Text as='p' size='2' color='gray' className={styles.description}>
          {description}
        </Text>
      )}
    </header>
  );
};

export default PageHeader;
