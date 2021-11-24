"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMockStr = exports.mockExportFooterTemp = exports.getMockHeaderTemp = void 0;
const utils_1 = require("../utils");
const getMockHeaderTemp = (fileType) => {
    if (fileType === 'js') {
        return `const Mock = require('mockjs'); \n\n\n
module.exports =  { \n`;
    }
    return `import type { Request, Response } from 'express';
import Mock from 'mockjs'; \n\n\n
export default { \n`;
};
exports.getMockHeaderTemp = getMockHeaderTemp;
exports.mockExportFooterTemp = `}`;
// type MockData = MockItem & { isArray: boolean };
const randomMockValue = (name = '', format = '') => {
    if (name.indexOf('time') > -1 || format.indexOf('time') > -1)
        return `Mock.Random.date('yyyy-MM-dd')`;
    if (name.indexOf('email') > -1)
        return 'Mock.Random.email()';
    if (name.indexOf('url') > -1)
        return 'Mock.Random.url()';
    if (name.indexOf('ip') > -1)
        return 'Mock.Random.ip()';
    if (name.indexOf('province') > -1)
        return 'Mock.Random.province()';
    if (name.indexOf('city') > -1)
        return 'Mock.Random.city()';
    if (name.indexOf('county') > -1)
        return 'Mock.Random.county()';
    if (name.indexOf('address') > -1)
        return 'Mock.Random.region()';
    if (name.endsWith('Id'))
        return 'Mock.Random.id()';
    return false;
};
const getMockKey = (item, key) => {
    const { format, type } = item;
    const random = randomMockValue(key, format);
    if (random)
        return key;
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
const getMockValue = (item, key) => {
    const { format, type } = item;
    const random = randomMockValue(key, format);
    if (random)
        return random;
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
const buildMockStr = function (data) {
    if (utils_1.dataType.includes(data.type)) {
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
    function deep(deepData, level) {
        let itemStr = '';
        Object.keys(deepData).forEach((key) => {
            const item = deepData[key];
            if (item.isArray === true) {
                const item2 = { ...item };
                delete item2.isArray;
                itemStr += `${space(level)}'${`${key}|1-10`}': [{ \n ${deep(item2, level + 1)} ${space(level)}}], \n`;
            }
            else if (item.type === undefined && Object.keys(item).length > 0) {
                const item2 = { ...item };
                delete item2.isArray;
                itemStr += `${space(level)}'${key}': { \n ${deep(item2, level + 1)} \n ${space(level)}}, \n`;
            }
            else {
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
exports.buildMockStr = buildMockStr;
const getMockContent = (funName, mockContent, fileType) => {
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
function mockTemp(apiPath, methods, response, options) {
    const { fileType } = options || {};
    const funName = (0, utils_1.transformPath)(apiPath).key;
    const mockContent = (0, exports.buildMockStr)(response && response.code && response.data ? response.data : response);
    const code = `"${methods.toLocaleUpperCase()} ${apiPath}": ${getMockContent(funName, mockContent, fileType)}`;
    return code;
}
exports.default = mockTemp;
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
