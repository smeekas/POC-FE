import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Global test environment setup.
 *
 * jsdom ships neither `matchMedia` nor `ResizeObserver`, and Mantine reaches for both
 * while rendering, so they are stubbed here once instead of in every test file.
 */

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView ??= () => {};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});
