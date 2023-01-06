/* eslint-disable no-param-reassign */
import chalk from 'chalk';
import type { Query } from '../../typings/swagger';

export const validataQuery = function (requestData: any, requestPath: string, options: Query) {
  const { tags, description } = requestData || {};
  const { keyword, tag, path } = options;
  if (keyword) {
    if (!description) return false;
    if (description.indexOf(keyword) === -1) return false;
  }
  if (path) {
    if (!requestPath) return false;
    if (typeof path === 'string' && requestPath.indexOf(path) === -1) {
      return false;
    }
    if (Array.isArray(path) && path.every((p) => requestPath.indexOf(p) === -1)) {
      return false;
    }
  }
  if (tag && Array.isArray(tags)) {
    return tags.some((t) => {
      return t.toLocaleUpperCase().indexOf(tag.toLocaleUpperCase()) > -1;
    });
  }
  return true;
};

export const dataType = ['string', 'number', 'array', 'object', 'integer', 'boolean', 'int32', 'int64', 'ref', 'file'];

/**
 *  转换节点格式，返回必须带type的node
 * @returns {object}   { "type": "string", "example": "100", "description": "名称"}
 */
export const normalNodeFormat = (node: any) => {
  const isNormal = node.type && typeof node.type === 'string';
  if (isNormal) return node;
  node.type = node.schema && node.schema.type;
  if (node.type) {
    if (node.schema) {
      delete node.schema;
    }
    if (typeof node.in === 'string') {
      delete node.in;
    }
  }
  return node;
};

/**
 * 校验节点是不是声明类型，声明数据必有type
 * @param node 节点
 * @returns
 */
export function verifyNodeIsDeclarationType(node: any) {
  if (!node) return false;
  const type = node.type || (node.schema && node.schema.type);
  if (!type) return false;
  return dataType.includes(type);
}

export function findResponseRef(request: any) {
  try {
    const {
      responses: {
        '200': {
          schema: { $ref: ref }
        }
      }
    } = request;
    return ref;
  } catch (e) {
    // console.error(e)
  }
  return null;
}

export function isObject(val: any) {
  return val && Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length > 0;
}

export function stringCase(str: string) {
  if (typeof str !== 'string') return '';
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

/**
 * 把路径拼装成驼峰式 文件名 transform
 * @param path 需要转换的路径
 * @param filterPrefix 需要过滤的前缀
 * @returns
 */
export function transformPath(path: string, filterPrefix = '') {
  const ret = path.split('/');
  const nameIdx = filterPrefix ? ret.indexOf(filterPrefix) : -1;
  const newArr = ret.filter((item, index) => {
    return index > nameIdx && item !== '/' && item !== '';
  });
  const upCaseArr = newArr.map((item, index) => {
    let pathRet = item;
    if (index > 0) {
      pathRet = item.slice(0, 1).toLocaleUpperCase() + item.slice(1);
    }
    return pathRet;
  });
  const key = upCaseArr.join('');
  const value = newArr.join('/');
  return {
    key,
    path: value
  };
}

export const log = {
  red(...args: any) {
    console.log(chalk.red(...args));
  },
  blue(...args: any) {
    console.log(chalk.blue(...args));
  },
  green(...args: any) {
    console.log(chalk.green(...args));
  },
  yellow(...args: any) {
    console.log(chalk.yellow(...args));
  },
  gray(...args: any) {
    console.log(chalk.gray(...args));
  }
};
