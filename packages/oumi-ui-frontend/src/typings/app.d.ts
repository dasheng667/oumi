export type ListItem = {
  path: string;
  name: string;
  id: string;
  href?: string;
  default?: boolean;
  collection?: boolean;
};

export type Blocks = {
  url: string;
  type: string;
  path: string;
  isPage: string;
  defaultPath: string;
  img: string;
  name: string;
  tags: string[];
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
