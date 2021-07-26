import { transformPath, dataType } from '../utils';

export const mockExportHeaderTemp = `
import type { Request, Response } from 'express';
import Mock from 'mockjs'; \n\n\n
export default { \n`;

export const mockExportFooterTemp = `}`;

type MockItem = {
  type: string;
  format?: string;
  description?: string;
};

type MockData = MockItem & { isArray: boolean };

const getMockKey = (item: MockItem, key: string) => {
  const { format, type } = item;
  if (format && format.indexOf('time') > -1) {
    return key;
  }
  if (type && type.indexOf('int') > -1) {
    return `${key}|1-999`;
  }
  if (type === 'string') {
    return `${key}|3-10`;
  }
  if (type === 'boolean') {
    return `${key}|1`;
  }
  return key;
};

const getMockValue = (item: MockItem) => {
  const { format, type } = item;
  if (format && format.indexOf('time') > -1) {
    return `Mock.Random.date('yyyy-MM-dd')`;
  }
  if (type && type.indexOf('int') > -1) {
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

const eachMockTemp = function (data: MockData) {
  const resultData = {};

  const deep = (deepData: MockData, res: any) => {
    if (dataType.indexOf(deepData.type)) {
      const mockKey = getMockKey(deepData, 'xx');
      const mockVal = getMockValue(deepData);
      res[mockKey] = mockVal;
      return;
    }
    Object.keys(deepData).forEach((key) => {
      const item = deepData[key];
      if (item.isArray === true) {
        const item2 = { ...item };
        delete item2.isArray;

        const res2 = {};
        res[`${key}|1-10`] = [res2];
        deep(item2, res2);
      } else if (item.type === undefined && Object.keys(item).length > 0) {
        const item2 = { ...item };
        delete item2.isArray;

        const res2 = {};
        res[key] = res2;
        deep(item2, res2);
      } else {
        const mockKey = getMockKey(item, key);
        const mockVal = getMockValue(item);
        res[mockKey] = mockVal;
      }
    });
  };

  deep(data, resultData);

  return resultData;
};

export const buildMockStr = function (data: any): string | boolean | number {
  if (dataType.includes(data.type)) {
    return data.type === 'boolean' ? true : '1';
  }
  if (data.isArray === true) {
    const item2 = { ...data };
    delete item2.isArray;
    return `[{ \n ${deep(item2)} }] \n `;
  }

  function deep(deepData: any) {
    let itemStr = '';
    Object.keys(deepData).forEach((key: string) => {
      const item = deepData[key];

      if (item.isArray === true) {
        const item2 = { ...item };
        delete item2.isArray;

        itemStr += `'${`${key}|1-10`}': [{ \n ${deep(item2)} }], \n`;
      } else if (item.type === undefined && Object.keys(item).length > 0) {
        const item2 = { ...item };
        delete item2.isArray;
        itemStr += `'${key}': { \n ${deep(item2)} \n }, \n`;
      } else {
        const mockKey = getMockKey(item, key);
        const mockVal = getMockValue(item);
        const description = item.description ? `/** ${item.description} */ \n` : '';
        itemStr += `${description} '${mockKey}': ${mockVal}, \n`;
      }
    });
    return itemStr;
  }

  return `{ \n ${deep(data)} } \n `;
};

export default function mockTemp(apiPath: string, methods: string, response: any) {
  const funName = transformPath(apiPath).key;

  // const mockContent = eachMockTemp(response && response.code && response.data ? response.data : response);
  const mockContent = buildMockStr(response && response.code && response.data ? response.data : response);

  const mockRequest = `function ${funName}(req: Request, res: Response, u: string){
  const data = ${mockContent};
  return res.send({ code: 200, data, success: true });
}, \n\n\n`;

  const code = `"${methods.toLocaleUpperCase()} ${apiPath}": ${mockRequest}`;
  return code;
}
