import React from 'react';
import { Switch, Route } from 'react-router-dom';

export default function renderRoutes(routes: any, extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: any, i: any) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) =>
            route.render ? (
              route.render({ ...props, ...extraProps, route })
            ) : (
              <route.component {...props} {...extraProps} route={route} />
            )
          }
        />
      ))}
    </Switch>
  ) : null;
}
