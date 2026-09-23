import './AuthFormHeader.css';

export type AuthFormHeaderProps = {
  /** Headline of the form, e.g. "Welcome back". */
  title: string;
  /** One line explaining what the form does. */
  subtitle: string;
};

/** Shared title block that sits above every auth form. */
export const AuthFormHeader = ({ title, subtitle }: AuthFormHeaderProps) => {
  return (
    <header className="auth-form-header">
      <h1 className="auth-form-header__title">{title}</h1>
      <p className="auth-form-header__subtitle">{subtitle}</p>
    </header>
  );
};
