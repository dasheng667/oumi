import React from 'react';
import { BrowserRouter as Router, HashRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import routers from './router';
import renderRoutes from './router/renderRoutes';

import 'antd/dist/antd.css';
import './App.css';

function App() {
  return <Router>{renderRoutes(routers)}</Router>;
}

export default App;
