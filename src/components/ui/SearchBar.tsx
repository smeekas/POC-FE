import type { InputHTMLAttributes, Ref } from 'react';

import { CloseIcon, SearchIcon } from '../icons';
import { TextInput } from './TextInput';

import styles from './SearchBar.module.css';

export type SearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> & {
  value: string;
  /** Receives the text itself rather than the event, since that is all a search needs. */
  onChange: (value: string) => void;
  /** Labels the input for screen readers; the placeholder alone is not a label. */
  label?: string;
  ref?: Ref<HTMLInputElement>;
};

/**
 * Controlled search field: a magnifier on the left, and a clear button on the right
 * that only appears once there is something to clear.
 *
 * The component does not debounce. A page that hits the API on every keystroke should
 * debounce the value it holds, so the input itself stays instant to type in.
 */
export const SearchBar = ({
  value,
  onChange,
  label = 'Search',
  placeholder = 'Search…',
  className,
  ref,
  ...inputProps
}: SearchBarProps) => {
  return (
    <div className={[styles.wrapper, className ?? ''].filter(Boolean).join(' ')}>
      <SearchIcon className={styles.searchIcon} />

      <TextInput
        ref={ref}
        type='search'
        aria-label={label}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
      />

      {value && (
        <button
          type='button'
          className={styles.clearButton}
          aria-label='Clear search'
          onClick={() => onChange('')}
        >
          <CloseIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
