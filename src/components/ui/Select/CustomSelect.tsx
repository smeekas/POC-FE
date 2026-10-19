import { Select, type Primitive, type SelectProps } from '@mantine/core';

import styles from './CustomSelect.module.css';

/**
 * The app's Select.
 *
 * It differs from Mantine's in how the current choice is marked: an accent tinted row
 * rather than a check icon, the same pair the active sidebar row uses.
 *
 * `withCheckIcon` sits before the spread so a caller can still ask for the icon back,
 * while `classNames` sits after it because the tint is the point of the component.
 */
function CustomSelect<T extends Primitive>(props: SelectProps<T>) {
  return (
    <Select<T>
      withCheckIcon={false}
      {...props}
      classNames={{ root: styles.root, option: styles.option }}
    />
  );
}

export default CustomSelect;
