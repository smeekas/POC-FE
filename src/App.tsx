import { appRouteTree } from './routes/routeTree';
import { RouteTreeRenderer } from './routes/RouteTreeRenderer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/** Root of the application: everything the user sees comes out of the route tree. */
const App = () => {
  return <RouteTreeRenderer routes={appRouteTree} />;
};

export default App;

/**
 *  FUTURE PLAN
 * no hardcoded feature
 * retrieve feature list
 * check if feature can be accessed or not
 * DYNAMIC RBAC
 */
