import React from 'react';
import { Route } from 'react-router-dom';
import renderRoutes from './renderRoutes';

const Root = ({ route }: any) => <>{renderRoutes(route.routes)}</>;

export default Root;
