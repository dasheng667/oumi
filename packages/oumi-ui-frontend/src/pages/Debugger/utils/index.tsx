/* eslint-disable no-param-reassign */
import type { TreeNode } from '../type';

export function updateTreeData(list: TreeNode[], key: React.Key, children: TreeNode[]): TreeNode[] {
  return list.map((node) => {
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

const getTitle = (url: string | undefined) => {
  if (!url) return '';
  const isHttp = url.startsWith('http');
  let title = isHttp ? new URL(url).pathname : url;
  if (isHttp && (title === '/' || !title)) {
    // 没有pathname
    title = new URL(url).hostname;
  }
  return title;
};

// 一位数组转换为多维数组
export const listToTreeList = (list: TreeNode[]): TreeNode[] => {
  const newList: TreeNode[] = [];

  if (Array.isArray(list)) {
    list.forEach((v) => {
      v.title = v.title || getTitle(v.url);
      if (v.pkey) {
        loop(newList, v.pkey, (val, i, vList) => {
          if (Array.isArray(val.children)) {
            val.children.push(v);
          } else {
            val.children = [v];
          }
        });
      } else {
        newList.push(v);
      }
    });
  }

  return newList;
};

export const assertObject = [{ name: 'Response JSON', value: '1' }];

export const assertSelect = [
  { name: '必需存在', value: 'required' },
  { name: '等于', value: 'eq' },
  { name: '不等于', value: 'neq' },
  // { name: '存在', value: 'exist' },
  // { name: '不存在', value: 'nexist' },
  { name: '小于', value: 'lt' },
  { name: '小于或等于', value: 'lte' },
  { name: '大于', value: 'gt' },
  { name: '大于或等于', value: 'gte' },
  { name: '包含', value: 'include' },
  { name: '不包含', value: 'ninclude' },
  { name: '为空', value: 'empty' }
];
