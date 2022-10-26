import React from 'react';
import asyncComponent from './asyncComponent';
import { Redirect } from 'react-router-dom';
import { ShoppingOutlined, ApiOutlined, SettingOutlined, SolutionOutlined, CodepenOutlined, BugOutlined } from '@ant-design/icons';
import type { IRouter } from '@src/typings/app';
import Layout from './Layout';

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
    component: Layout,
    routes: [
      {
        path: '/',
        label: '首页',
        exact: true,
        component: () => <Redirect to="/tasks" />
      },

      {
        path: '/tasks',
        label: '任务',
        component: asyncComponent(() => import(`../pages/Tasks`))
      },

      {
        path: '/tasks/:id',
        label: '任务',
        component: asyncComponent(() => import(`../pages/Tasks`))
      },

      {
        path: '/project/select',
        label: '选择项目',
        exact: true,
        component: asyncComponent(() => import(`../pages/ProjectSelect`))
      },

      {
        path: '/dashboard',
        label: '仪表盘',
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
        path: '/swagger/:id',
        label: 'Swagger',
        multiple: true,
        component: asyncComponent(() => import(`../pages/Swagger/apiList`))
      },

      {
        path: '/doc/:path',
        label: '文档',
        multiple: true,
        component: asyncComponent(() => import(`../pages/Swagger/apiDetail`))
      },

      {
        path: '/blocks',
        label: '资产',
        exact: true,
        component: asyncComponent(() => import(`../pages/Blocks`))
      },

      {
        path: '/config',
        label: '配置',
        exact: true,
        component: asyncComponent(() => import(`../pages/Config`))
      },

      {
        path: '/deps',
        label: '依赖',
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
      },

      {
        path: '/editor/:path',
        label: '编辑器',
        multiple: true,
        component: asyncComponent(() => import(`../pages/Editor`))
      }
    ]
  }
];

export default router;
