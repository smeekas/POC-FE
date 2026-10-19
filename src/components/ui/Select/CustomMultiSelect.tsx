import {
  MultiSelect,
  Pill,
  type MultiSelectProps,
  type Primitive,
} from '@mantine/core';

import styles from './CustomSelect.module.css';

export type CustomMultiSelectProps<T extends Primitive> =
  MultiSelectProps<T> & {
    /** Pills to show before the rest collapse into a `+N`. */
    maxDisplayedValues?: number;
  };

/**
 * The app's MultiSelect, marking chosen options the way `CustomSelect` does: an accent
 * tinted row rather than a check icon.
 *
 * Selections past `maxDisplayedValues` collapse into a single `+N` pill, so the control
 * keeps its height however many options are picked. That needs to know each pill's
 * position in the selection, which only a controlled `value` can give; passed none, the
 * component leaves Mantine's wrapping pill list alone.
 *
 * `withCheckIcon` and `renderPill` sit before the spread so a caller can still override
 * them, while `classNames` sits after it because the tint is the point of the component.
 */
function CustomMultiSelect<T extends Primitive>({
  maxDisplayedValues = 2,
  ...props
}: CustomMultiSelectProps<T>) {
  const { value } = props;

  const renderPill: MultiSelectProps<T>['renderPill'] = ({
    option,
    value: pillValue,
    onRemove,
    disabled,
  }) => {
    const index = value!.findIndex((item) => item === pillValue);

    if (index < maxDisplayedValues) {
      return (
        <Pill
          withRemoveButton={!disabled && !props.readOnly}
          onRemove={onRemove}
          disabled={disabled}
        >
          {option.label}
        </Pill>
      );
    }

    /* Every pill past the cap renders nothing, so the counter has to ride on the first
       of them rather than being appended after the list. */
    if (index === maxDisplayedValues) {
      return <Pill>+{value!.length - maxDisplayedValues}</Pill>;
    }

    return null;
  };

  return (
    <MultiSelect<T>
      withCheckIcon={false}
      renderPill={value ? renderPill : undefined}
      {...props}
      classNames={{
        root: styles.root,
        option: styles.option,
        pillsList: value ? styles.pillsList : undefined,
      }}
    />
  );
}

export default CustomMultiSelect;
