export type ProjectListItem = {
  path: string;
  name: string;
  id: string;
};

export type IRouter = {
  path?: string;
  name?: string;
  label?: string;

  exact?: boolean;
  redirect?: string;
  component?: any;

  routes?: IRouter[];
};
