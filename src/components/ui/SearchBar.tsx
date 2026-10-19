import { CloseButton, TextInput, type TextInputProps } from '@mantine/core';
import { useEffect, useMemo, useState, type Ref } from 'react';

import { debounce } from '../../utils/debounce';
import { SearchIcon } from '../icons';

/** Long enough to cover the pause between keystrokes, short enough to feel immediate. */
const DEFAULT_DEBOUNCE_MS = 400;

export type SearchBarProps = Omit<
  TextInputProps,
  'value' | 'onChange' | 'type' | 'defaultValue'
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
    search(nextValue.trim());
  };

  /* Clearing is a decision rather than a keystroke, so it does not wait out the debounce. */
  const handleClear = () => {
    search.cancel();
    setValue('');
    onSearch('');
  };

  return (
    <TextInput
      ref={ref}
      type='search'
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      leftSection={<SearchIcon />}
      rightSection={
        value ? (
          <CloseButton
            size='sm'
            aria-label='Clear search'
            onClick={handleClear}
          />
        ) : null
      }
      {...inputProps}
    />
  );
};

export default SearchBar;
