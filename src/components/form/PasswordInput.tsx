import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from '../icons';
import { TextInput } from '../ui/TextInput';

import styles from './PasswordInput.module.css';

export type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

/**
 * Password field with a show/hide toggle.
 *
 * The toggle is a real button so it is reachable by keyboard, and it announces its
 * current state rather than relying on the icon alone.
 */
export const PasswordInput = ({
  id,
  name,
  value,
  placeholder,
  invalid,
  autoComplete,
  onChange,
  onBlur,
}: PasswordInputProps) => {
  const [isValueVisible, setIsValueVisible] = useState(false);

  const toggleValueVisibility = () => {
    setIsValueVisible((previousIsVisible) => !previousIsVisible);
  };

  return (
    <div className={styles.wrapper}>
      <TextInput
        id={id}
        name={name}
        value={value}
        className={styles.input}
        type={isValueVisible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        invalid={invalid}
        onChange={onChange}
        onBlur={onBlur}
      />

      <button
        type="button"
        className={styles.toggle}
        aria-label={isValueVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isValueVisible}
        onClick={toggleValueVisibility}
      >
        {isValueVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};
