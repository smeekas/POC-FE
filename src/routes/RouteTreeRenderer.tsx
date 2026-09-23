import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router';

import type { AppRouteNode } from './route.types';

export type RouteTreeRendererProps = {
  /** The route tree to turn into `<Route>` elements. */
  routes: AppRouteNode[];
};

/**
 * Walks a route tree and produces the nested `<Route>` elements react-router expects.
 *
 * Nodes without a `path` (layouts and guards) still become routes so that their
 * `<Outlet />` wraps every descendant.
 */
const renderRouteNodes = (routes: AppRouteNode[]): ReactNode[] => {
  return routes.map((route, routeIndex) => {
    const routeKey = route.path ?? `layout-${routeIndex}`;

    if (route.index) {
      return <Route key={routeKey} index element={route.element} />;
    }

    return (
      <Route key={routeKey} path={route.path} element={route.element}>
        {route.children ? renderRouteNodes(route.children) : null}
      </Route>
    );
  });
};

/** Renders the whole application route tree inside a single `<Routes />`. */
export const RouteTreeRenderer = ({ routes }: RouteTreeRendererProps) => {
  return <Routes>{renderRouteNodes(routes)}</Routes>;
};
