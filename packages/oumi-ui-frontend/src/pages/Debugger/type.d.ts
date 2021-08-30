export interface Panes {
  key: string;
  title: string;
  content?: string;
  url?: string;
  env?: string;
  method?: 'get' | 'post';
}

export type Env = 'dev' | 'test' | 'prod';
