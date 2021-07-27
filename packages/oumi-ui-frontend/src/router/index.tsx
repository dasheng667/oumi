import React from 'react';
import asyncComponent from './asyncComponent';
import { Redirect } from 'react-router-dom';
import App from './Root';
import type { IRouter } from '../global';

const router: IRouter[] = [
  {
    component: App,
    routes: [
      {
        path: '/',
        label: '首页',
        exact: true,
        component: () => <Redirect to="/dashboard/swagger" />
      },

      {
        path: '/project/select',
        label: '选择项目',
        exact: true,
        component: asyncComponent(() => import(`../pages/ProjectSelect`))
      },

      {
        path: '/dashboard',
        label: '看板',
        component: asyncComponent(() => import(`../pages/Dashboard`)),

        routes: [
          {
            name: 'Swagger',
            path: '/dashboard/swagger',
            exact: true,
            component: asyncComponent(() => import(`../pages/Swagger`))
          },

          {
            name: 'Config',
            path: '/dashboard/config',
            exact: true,
            component: asyncComponent(() => import(`../pages/Config`))
          }
        ]
      }
    ]
  }
];

export default router;
