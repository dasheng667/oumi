import { transformPath, dataType } from '../utils';

export const getMockHeaderTemp = (fileType: 'js' | 'ts') => {
  if (fileType === 'js') {
    return `const Mock = require('mockjs'); \n\n\n
module.exports =  { \n`;
  }

  return `import type { Request, Response } from 'express';
import Mock from 'mockjs'; \n\n\n
export default { \n`;
};

export const mockExportFooterTemp = `}`;

type MockItem = {
  type: string;
  format?: string;
  description?: string;
};

// type MockData = MockItem & { isArray: boolean };

const descMatchValue = (description: string) => {
  if (typeof description === 'string') {
    const res = description.match(/(\d+)/g);
    if (res && Array.isArray(res)) {
      return `'${res}'.split(',')`;
    }
  }
  return false;
};

const randomMockValue = (name: string, item: MockItem) => {
  const { type = '', format = '', description = '' } = item;

  if (name === 'remark') return `'@ctitle(3, 10)'`;
  if (name.endsWith('Count') || name.endsWith('Num') || name.endsWith('Min') || name.endsWith('Max')) return `'@integer(1, 100)'`;
  if (name.endsWith('Day') || name.endsWith('Days')) return `'@now'`;
  if (name.endsWith('Text')) return `'@title'`;
  if (name.endsWith('Name')) return `'@ctitle'`;
  if (name.indexOf('time') > -1 || format.indexOf('time') > -1 || name.endsWith('Date') || name.endsWith('Time')) return `'@date'`;
  if (name.indexOf('email') > -1) return `'@email'`;
  if (name.indexOf('url') > -1) return `'@url'`;
  if (name.indexOf('ip') > -1) return `'@ip'`;
  if (name.indexOf('province') > -1 || name.endsWith('Address') || name === 'address') return `'@province'`;
  if (name.indexOf('city') > -1) return `'@city'`;
  if (name.indexOf('county') > -1) return `'@county'`;
  if (name.indexOf('address') > -1) return `'@region'`;
  if (name.endsWith('Id') || name.endsWith('Code') || name.endsWith('Key')) return `'@id'`;
  if (name.endsWith('Img') || name.endsWith('Image'))
    return `[
    Mock.Random.image('200x100', '#FF6600'),
    Mock.Random.image('800x500', '#4A7BF7', 'who am i'),
  ].join(',')`;

  if (name.endsWith('Price')) return `'@float(10, 100, 3)'`;
  if (name.endsWith('Type') || name.endsWith('Status')) return descMatchValue(description) || `'${name}'`;

  if (type === 'boolean') return `'@boolean()'`;
  if (type === 'int' || type === 'integer' || type === 'number') return `'@integer(10, 100)'`;
  if (type === 'float') return `'@float(10, 100, 3)'`;

  return `'${name}'`;
};

// const randomMockValue = (name: string = '', format: string = '') => {
//   if (name.indexOf('time') > -1 || format.indexOf('time') > -1) return `Mock.Random.date('yyyy-MM-dd')`;
//   if (name.indexOf('email') > -1) return 'Mock.Random.email()';
//   if (name.indexOf('url') > -1) return 'Mock.Random.url()';
//   if (name.indexOf('ip') > -1) return 'Mock.Random.ip()';
//   if (name.indexOf('province') > -1) return 'Mock.Random.province()';
//   if (name.indexOf('city') > -1) return 'Mock.Random.city()';
//   if (name.indexOf('county') > -1) return 'Mock.Random.county()';
//   if (name.indexOf('address') > -1) return 'Mock.Random.region()';
//   if (name.endsWith('Id')) return 'Mock.Random.id()';
//   return false;
// };

const getMockKey = (item: MockItem, key: string) => {
  const { format, type, description } = item;
  if (key.endsWith('Type') || key.endsWith('Status')) {
    const is = descMatchValue(description);
    return is ? `${key}|1` : key; // 如果是数组，生成 'key|1'，mock取其中一个
  }
  return key;
};
// const getMockKey = (item: MockItem, key: string) => {
//   const { format, type, description } = item;
//   const random = randomMockValue(key, format, description);
//   if (random) return key;
//   if (typeof type === 'string' && type.indexOf('int') > -1) {
//     return `${key}|1-999`;
//   }
//   if (type === 'string') {
//     return `${key}|3-10`;
//   }
//   if (type === 'boolean') {
//     return `${key}|1`;
//   }
//   return key;
// };

const getMockValue = (item: MockItem, key) => {
  const { format, type, description } = item;
  const random = randomMockValue(key, item);
  if (random) return random;
  return key;
  // 更改了规则， 下面暂时不要。
  if (typeof type === 'string' && type.indexOf('int') > -1) {
    return 1;
  }
  if (type === 'string') {
    return '1';
  }
  if (type === 'boolean') {
    return true;
  }
  return '1';
};

export const buildMockStr = function (data: any): string | boolean | number {
  if (!data) return '{}';
  if (dataType.includes(data.type)) {
    return data.type === 'boolean' ? true : '1';
  }
  if (data.isArray === true) {
    const item2 = { ...data };
    delete item2.isArray;
    return `[{ \n ${deep(item2, 0)} }] \n `;
  }

  function space(number) {
    return Array.from(new Array(number)).join(' ');
  }

  function deep(deepData: any, level: number) {
    let itemStr = '';
    Object.keys(deepData).forEach((key: string) => {
      const item = deepData[key];

      if (item.isArray === true) {
        const item2 = { ...item };
        delete item2.isArray;

        itemStr += `${space(level)}'${`${key}`}': [...Array(10)].map(() => ({ \n ${deep(item2, level + 1)} ${space(level)}  })), \n`;
      } else if (item.type === undefined && Object.keys(item).length > 0) {
        const item2 = { ...item };
        delete item2.isArray;
        itemStr += `${space(level)}'${key}': { \n ${deep(item2, level + 1)} \n ${space(level)}}, \n`;
      } else {
        const mockKey = getMockKey(item, key);
        const mockVal = getMockValue(item, key);
        const description = item.description ? `${space(level)} /** ${item.description} */\n` : '';
        itemStr += `${description} ${space(level)}'${mockKey}': ${mockVal}, \n`;
      }
    });
    return itemStr;
  }

  return `{ \n ${deep(data, 0)} } \n `;
};

const getMockContent = (funName: string, mockContent: any, fileType: 'ts' | 'js') => {
  if (fileType === 'ts') {
    return `(req: Request, res: Response, u: string) => {
      const data = ${mockContent}
      return res.send({ code: 200, data: Mock.mock(data), success: true, msg: '' });
    }, \n\n\n`;
  }
  return `(req, res, u) => {
    const data = ${mockContent}
    return res.send({ code: 200, data: Mock.mock(data), success: true, msg: '' });
  }, \n\n\n`;
};

export default function mockTemp(apiPath: string, methods: string, response: any, options) {
  const { fileType } = options || {};
  const funName = transformPath(apiPath).key;

  const mockContent = buildMockStr(response && response.code && response.data ? response.data : response);

  const code = `"${methods.toLocaleUpperCase()} ${apiPath}": ${getMockContent(funName, mockContent, fileType)}`;
  return code;
}

// const eachMockTemp = function (data: MockData) {
//   const resultData = {};

//   const deep = (deepData: MockData, res: any) => {
//     if (dataType.indexOf(deepData.type)) {
//       const mockKey = getMockKey(deepData, 'xx');
//       const mockVal = getMockValue(deepData);
//       res[mockKey] = mockVal;
//       return;
//     }
//     Object.keys(deepData).forEach((key) => {
//       const item = deepData[key];
//       if (item.isArray === true) {
//         const item2 = { ...item };
//         delete item2.isArray;

//         const res2 = {};
//         res[`${key}|1-10`] = [res2];
//         deep(item2, res2);
//       } else if (item.type === undefined && Object.keys(item).length > 0) {
//         const item2 = { ...item };
//         delete item2.isArray;

//         const res2 = {};
//         res[key] = res2;
//         deep(item2, res2);
//       } else {
//         const mockKey = getMockKey(item, key);
//         const mockVal = getMockValue(item);
//         res[mockKey] = mockVal;
//       }
//     });
//   };

//   deep(data, resultData);

//   return resultData;
// };
