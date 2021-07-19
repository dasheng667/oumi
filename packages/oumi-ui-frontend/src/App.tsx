import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import routers from './router';

import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        {routers.map((route) => {
          const { path, exact, redirect } = route;
          return (
            <Route
              path={path}
              key={path}
              exact={exact}
              render={(routeProps: any) => {
                if (redirect) {
                  return <Redirect to={redirect} />;
                }
                if (route.component) {
                  return <route.component {...routeProps} />;
                }
                return null;
              }}
            ></Route>
          );
        })}
      </Switch>
    </Router>
  );
}

export default App;
