export interface Panes {
  key: string;
  title: string;
  pkey?: string;
  content?: string;
  url?: string;
  env?: string;
  method?: 'get' | 'post';
  /** 是测试用例 */
  isTest?: boolean;
  /** 新建的tab */
  isNew?: boolean;
}

export type Env = 'dev' | 'test' | 'prod';

export type IResponseData = {
  assertResult: (IRequestPostItem & { success?: boolean })[];
  requestHeader: any;
  header: any;
  body: any;
  fetchUrl: string;
  isJSON: boolean;
  method: 'get' | 'post';
  status: number;
  statusText: string;
  timer: number;
};

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

export interface TreeNode {
  title: string;
  key: string;
  pkey?: string;
  method?: 'get' | 'post';
  url?: string;
  env?: Env;
  isLeaf?: boolean;
  /** 是测试用例 */
  isTest?: boolean;
  children?: TreeNode[];
  icon?: any;
}

interface IRequestPostItem {
  key: string;
  type: 'assert';
  name: string;
  assertObject: string;
  expression: string;
  assertEnumKey: string;
  assertValue: string;
}
