import asyncComponent from './asyncComponent';
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
        component: asyncComponent(() => import(`../pages/Dashboard`))
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
            name: 'Config',
            path: '/dashboard/config',
            component: asyncComponent(() => import(`../pages/Config`))
          },

          {
            name: 'Swagger',
            path: '/dashboard/swagger',
            component: asyncComponent(() => import(`../pages/Swagger`))
          }
        ]
      }
    ]
  }
];

export default router;
