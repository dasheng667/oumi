import React from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';

export default function renderRoutes(routes: any, extraProps = {}, switchProps = {}) {
  return routes ? (
    <CacheSwitch {...switchProps}>
      {routes.map((route: any, i: any) => (
        <CacheRoute
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) =>
            route.render ? route.render({ ...props, ...extraProps, route }) : <route.component {...props} {...extraProps} route={route} />
          }
        />
      ))}
      <Route render={() => <div>404 未找到页面</div>} />
    </CacheSwitch>
  ) : null;
}
