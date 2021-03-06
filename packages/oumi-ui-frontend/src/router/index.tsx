import React from 'react';
import asyncComponent from './asyncComponent';
import { Redirect } from 'react-router-dom';
import {
  ShoppingOutlined,
  ApiOutlined,
  SettingOutlined,
  SolutionOutlined,
  CodepenOutlined,
  BugOutlined
} from '@ant-design/icons';
import App from './Root';
import type { IRouter } from '../global';

export const menuList = [
  {
    name: '任务',
    path: '/tasks',
    icon: <SolutionOutlined />
  },
  {
    name: '依赖',
    path: '/deps',
    icon: <CodepenOutlined />
  },
  {
    name: '资产',
    path: '/blocks',
    icon: <ShoppingOutlined />
  },
  {
    name: 'Swagger',
    path: '/swagger',
    icon: <ApiOutlined />
  },
  {
    name: '接口调试',
    path: '/debugger',
    icon: <BugOutlined />
  },
  {
    name: '配置',
    path: '/config',
    icon: <SettingOutlined />
  }
];

const router: IRouter[] = [
  {
    component: App,
    routes: [
      {
        path: '/',
        label: '首页',
        exact: true,
        component: () => <Redirect to="/tasks" />
      },

      {
        path: '/project/select',
        label: '选择项目',
        exact: true,
        component: asyncComponent(() => import(`../pages/ProjectSelect`))
      },

      {
        path: '/dashboard',
        label: 'Dashboard',
        exact: true,
        component: asyncComponent(() => import(`../pages/Dashboard`))
      },

      {
        path: '/swagger',
        label: 'Swagger',
        exact: true,
        component: asyncComponent(() => import(`../pages/Swagger`))
      },

      {
        path: '/tasks',
        label: 'Tasks',
        component: asyncComponent(() => import(`../pages/Tasks`))
      },

      {
        path: '/tasks/:id',
        label: 'Tasks',
        component: asyncComponent(() => import(`../pages/Tasks`))
      },

      {
        path: '/blocks',
        label: 'Blocks',
        exact: true,
        component: asyncComponent(() => import(`../pages/Blocks`))
      },

      {
        path: '/config',
        label: 'Config',
        exact: true,
        component: asyncComponent(() => import(`../pages/Config`))
      },

      {
        path: '/deps',
        label: 'Deps',
        exact: true,
        component: asyncComponent(() => import(`../pages/Deps`))
      },

      {
        path: '/debugger',
        label: 'Debugger',
        exact: true,
        component: asyncComponent(() => import(`../pages/Debugger`))
      },

      {
        path: '/debugger/:id',
        label: 'Debugger',
        exact: true,
        component: asyncComponent(() => import(`../pages/Debugger`))
      }

      // {
      //   path: '/dashboard',
      //   label: 'dashboard',
      //   component: asyncComponent(() => import(`../pages/Dashboard`)),

      //   routes: [
      //     {
      //       name: 'tasks',
      //       path: '/dashboard/tasks',
      //       exact: true,
      //       component: asyncComponent(() => import(`../pages/Tasks`))
      //     },

      //     {
      //       name: 'Swagger',
      //       path: '/dashboard/swagger',
      //       exact: true,
      //       component: asyncComponent(() => import(`../pages/Swagger`))
      //     },

      //     {
      //       name: 'Config',
      //       path: '/dashboard/config',
      //       exact: true,
      //       component: asyncComponent(() => import(`../pages/Config`))
      //     }
      //   ]
      // },
    ]
  }
];

export default router;
