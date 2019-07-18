import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Balance from 'components/Balance';

const renderRoutes = (rootComponent) => (
  <Router history={browserHistory}>
    <Route component={rootComponent}>
      <Route path="/" component={Balance} />
    </Route>
  </Router>
);

export default renderRoutes;
