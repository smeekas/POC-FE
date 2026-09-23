import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from '../icons';
import { TextInput } from '../ui/TextInput';

import './PasswordInput.css';

export type PasswordInputProps = {
  /** Id of the underlying input, matching the label that describes it. */
  id: string;
  /** Field name as react-hook-form knows it. */
  name: string;
  /** Current value of the field. */
  value: string;
  /** Placeholder shown while the field is empty. */
  placeholder?: string;
  /** Marks the field red when its validation has failed. */
  invalid?: boolean;
  /** Hints the browser at which password this is, e.g. `current-password`. */
  autoComplete?: string;
  /** Called on every keystroke. */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Called when the field loses focus, so react-hook-form can mark it touched. */
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
    <div className="password-input">
      <TextInput
        id={id}
        name={name}
        value={value}
        type={isValueVisible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        invalid={invalid}
        onChange={onChange}
        onBlur={onBlur}
      />

      <button
        type="button"
        className="password-input__toggle"
        aria-label={isValueVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isValueVisible}
        onClick={toggleValueVisibility}
      >
        {isValueVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};
