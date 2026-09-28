import styles from './AuthFormHeader.module.css';

export type AuthFormHeaderProps = {
  title: string;
  subtitle: string;
};

/** Shared title block that sits above every auth form. */
export const AuthFormHeader = ({ title, subtitle }: AuthFormHeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
};
