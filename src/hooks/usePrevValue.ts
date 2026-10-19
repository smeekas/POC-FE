// oxlint-disable react/refs
import { useRef } from 'react';

export function usePrevValue<T>(value: T) {
  const ref = useRef<T>(value);
  const secondRef = useRef<T>(value);
  if (ref.current !== value) {
    secondRef.current = ref.current;
    ref.current = value;
  }
  return secondRef.current;
}
