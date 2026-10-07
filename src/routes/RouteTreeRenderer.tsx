import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router';

import type { AppRouteNode } from './route.types';
import { PrivateRoute } from './guards/PrivateRoute';
import { PublicRoute } from './guards/PublicRoute';

export type RouteTreeRendererProps = {
  routes: AppRouteNode[];
};

const renderRouteNodes = (routes: AppRouteNode[]): ReactNode[] => {
  return routes.map((route, routeIndex) => {
    const routeKey = route.path ?? `layout-${routeIndex}`;

    let element = (route.guard || []).reduce(
      (acc, CurrentComponent) => {
        return <CurrentComponent>{acc}</CurrentComponent>;
      },
      <route.element />,
    );
    if (route.private) {
      element = <PrivateRoute>{element}</PrivateRoute>;
    } else if (route.private == false) {
      element = <PublicRoute>{element}</PublicRoute>;
    }

    if (route.children) {
      return (
        <Route key={routeKey} path={route.path} element={element}>
          {renderRouteNodes(route.children)}
        </Route>
      );
    } else {
      return (
        <Route
          key={routeKey}
          path={route.path}
          index={Boolean(route.index)}
          element={element}
        />
      );
    }
  });
};

/** Renders the whole application route tree inside a single `<Routes />`. */
export const RouteTreeRenderer = ({ routes }: RouteTreeRendererProps) => {
  return <Routes>{renderRouteNodes(routes)}</Routes>;
};
