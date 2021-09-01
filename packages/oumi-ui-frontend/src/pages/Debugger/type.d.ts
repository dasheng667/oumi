export interface Panes {
  key: string;
  title: string;
  content?: string;
  url?: string;
  env?: string;
  method?: 'get' | 'post';
}

export type Env = 'dev' | 'test' | 'prod';

export type IRequestData = {
  query: any[];
  bodyFormData: any[];
  bodyJSON: any[];
  header: any[];
  cookie: any[];
};

export type IRequestDataKey = keyof IRequestData;

export type EditTableItem = {
  key: string;
  name: string;
  value: string;
  remark: string;
};
