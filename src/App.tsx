import { appRouteTree } from './routes/routeTree';
import { RouteTreeRenderer } from './routes/RouteTreeRenderer';

/** Root of the application: everything the user sees comes out of the route tree. */
const App = () => {
  return <RouteTreeRenderer routes={appRouteTree} />;
};

export default App;
