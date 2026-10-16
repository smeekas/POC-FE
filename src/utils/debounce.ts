/**
 * Holds a call back until `delayMs` has passed without another one.
 *
 * Each call cancels the one waiting before it, so a burst of calls results in a single
 * run carrying the arguments of the last one.
 */
export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delayMs);
  };

  /** Drops a pending call, for when the caller goes away before it fires. */
  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}
