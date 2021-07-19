import asyncComponent from './asyncComponent';

type Router = {
  path: string;

  exact?: boolean;
  name?: string;
  redirect?: string;
  component?: string;
};
export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: asyncComponent(() => import(`../pages/Dashboard`))
  },
  {
    name: 'project-select',
    path: '/project/select',
    component: asyncComponent(() => import(`../pages/ProjectSelect`))
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
] as Router[];
