import React from 'react';
import { useIsViewer } from '../modules/documents/hooks/useIsViewer';

export function withViewerControl<T extends { disabled?: boolean }>(
  Compo: React.ComponentType<T>,
) {
  return function FunctionalComponent<K extends T & { id: number }>({
    id,
    ...rest
  }: K) {
    const isDisabled = useIsViewer(id);
    return <Compo {...(rest as K)} disabled={rest.disabled || isDisabled} />;
  };
}
