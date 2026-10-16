import {
  useEffect,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type Ref,
} from 'react';

import { debounce } from '../../utils/debounce';
import { CloseIcon, SearchIcon } from '../icons';
import { TextInput } from './TextInput';

import styles from './SearchBar.module.css';

/** Long enough to cover the pause between keystrokes, short enough to feel immediate. */
const DEFAULT_DEBOUNCE_MS = 400;

export type SearchBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> & {
  /** The text the field starts with, typically whatever the URL already carries. */
  defaultValue?: string;
  /** Receives the text once typing has paused, rather than on every keystroke. */
  onSearch: (value: string) => void;
  debounceMs?: number;
  /** Labels the input for screen readers; the placeholder alone is not a label. */
  label?: string;
  ref?: Ref<HTMLInputElement>;
};

/**
 * Search field with a magnifier on the left and a clear button on the right that only
 * appears once there is something to clear.
 *
 * The typed text is held here so the field stays instant, while `onSearch` waits for a
 * pause — a caller can hit the API from it directly without spending a request per key.
 */
export const SearchBar = ({
  defaultValue = '',
  onSearch,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  label = 'Search',
  placeholder = 'Search…',
  className,
  ref,
  ...inputProps
}: SearchBarProps) => {
  const [value, setValue] = useState(defaultValue);

  /* One timer for the life of the field: debouncing inline would build a new one every
     render and so never actually wait. `onSearch` therefore has to be stable — memoize
     it at the call site. */
  const search = useMemo(
    () => debounce(onSearch, debounceMs),
    [onSearch, debounceMs],
  );

  useEffect(() => search.cancel, [search]);

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    search(nextValue);
  };

  /* Clearing is a decision rather than a keystroke, so it does not wait out the debounce. */
  const handleClear = () => {
    search.cancel();
    setValue('');
    onSearch('');
  };

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
        onChange={(event) => handleChange(event.target.value)}
        {...inputProps}
      />

      {value && (
        <button
          type='button'
          className={styles.clearButton}
          aria-label='Clear search'
          onClick={handleClear}
        >
          <CloseIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
