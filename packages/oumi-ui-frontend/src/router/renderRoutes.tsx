import React from 'react';
import { Route } from 'react-router-dom';
import C, { CacheSwitch } from 'react-router-cache-route';
import ErrorBoundary from '@src/Components/ErrorBoundary';

// @ts-ignore
const CacheRoute = C.default ? C.default : C;

export default function renderRoutes(routes: any, extraProps = {}, switchProps = {}) {
  return routes ? (
    <CacheSwitch {...switchProps}>
      {routes.map((route: any, i: any) => (
        <CacheRoute
          key={route.key || i}
          cacheKey={
            route.multiple
              ? (props: any) => {
                  return props.location!.pathname;
                }
              : route.path
          }
          multiple={route.multiple}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props: any) => (
            <ErrorBoundary>
              {route.render ? (
                route.render({ ...props, ...extraProps, route })
              ) : (
                <route.component {...props} {...extraProps} route={route} />
              )}
            </ErrorBoundary>
          )}
        />
      ))}
      <Route render={() => <div>404 未找到页面</div>} />
    </CacheSwitch>
  ) : null;
}
