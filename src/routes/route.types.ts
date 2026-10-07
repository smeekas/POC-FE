import type { ReactNode } from 'react';

/**
 * One node of the application route tree.
 *
 * A node either renders a page (`path` + `element`), wraps children in a layout or a
 * guard (`element` + `children`), or marks the default child of its parent (`index`).
 */
export type AppRouteNode = {
  /** URL segment for this node. Omitted for pure layout/guard wrappers. */
  path?: string;
  /** Marks this node as the default match for its parent path. Cannot be combined with `path`. */
  index?: boolean;
  /** What renders at this node. Wrappers must render an `<Outlet />` for children to appear. */
  element: React.FC;
  /** Nested routes rendered inside this node's `<Outlet />`. */
  children?: AppRouteNode[];
  guard?: React.FC<{ children: ReactNode }>[];
  private?: boolean;
};
