export { default as toResponseJSON } from '@oumi/swagger-api/src/core/toResponseJSON';

export const createId = (max: number = 8, randomString?: string) => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * hexDigits.length), 1);
  }
  return s.join('');
};

export function updateTreeData<T extends unknown[]>(list: T, key: React.Key, children: T): T {
  return (list as any).map((node: any) => {
    if (node.key === key) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });
}

type LoopCallBack = (val: any, index: number, dataList: any[]) => void;

export const loop = (data: any, key: string, callback: LoopCallBack) => {
  if (!Array.isArray(data)) return;
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      callback(data[i], i, data);
      return;
    }
    if (data[i].children) {
      loop(data[i].children, key, callback);
    }
  }
};

export const arrSortByKey = function (key: string, order?: 'asc' | 'desc'): any {
  return function (o: any, p: any): number {
    let a: any;
    let b: any;
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      a = o[key];
      b = p[key];
      if (a === b) {
        return 0;
      }
      if (typeof a === typeof b) {
        if (!order || order === 'asc') {
          return a < b ? -1 : 1;
        }
        if (order === 'desc') {
          return a > b ? -1 : 1;
        }
      }
      return typeof a < typeof b ? -1 : 1;
    }
    return 0;
  };
};

export const taskViewGroup = <T>(arr: any) => {
  const group: { [k in string]: T[] } = {};
  arr.forEach((item: any) => {
    const groupName = item.name.substr(0, 1);
    if (!group[groupName]) {
      group[groupName] = [];
    }
    group[groupName].push(item);
  });
  return group;
};
