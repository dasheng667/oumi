"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockExportFooterTemp = exports.mockExportHeaderTemp = void 0;
const utils_1 = require("../utils");
exports.mockExportHeaderTemp = `
import type { Request, Response } from 'express';
import Mock from 'mockjs'; \n\n\n
export default { \n`;
exports.mockExportFooterTemp = `}`;
const getMockKey = (item, key) => {
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
const getMockValue = (item) => {
    const { format, type } = item;
    if (format && format.indexOf('time') > -1) {
        return `#Mock.Random.date('yyyy-MM-dd')#`;
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
const eachMockTemp = function (data) {
    const resultData = {};
    const deep = (deepData, res) => {
        Object.keys(deepData).forEach((key) => {
            const item = deepData[key];
            if (item.isArray === true) {
                const item2 = { ...item };
                delete item2.isArray;
                const res2 = {};
                res[`${key}|1-10`] = [res2];
                deep(item2, res2);
            }
            else if (item.type === undefined && Object.keys(item).length > 0) {
                const item2 = { ...item };
                delete item2.isArray;
                const res2 = {};
                res[key] = res2;
                deep(item2, res2);
            }
            else {
                const mockKey = getMockKey(item, key);
                const mockVal = getMockValue(item);
                res[mockKey] = mockVal;
            }
        });
    };
    deep(data, resultData);
    return resultData;
};
function mockTemp(apiPath, methods, response) {
    const funName = utils_1.transformPath(apiPath).key;
    const mockContent = eachMockTemp((response && response.code && response.data) ? response.data : response);
    const mockRequest = `function ${funName}(req: Request, res: Response, u: string){
  const data = ${JSON.stringify(mockContent, null, 2).replace(/"#/g, '').replace(/#"/g, '')};
  return res.send({ code: 200, data, success: true });
}, \n\n\n`;
    const code = `"${methods.toLocaleUpperCase()} ${apiPath}": ${mockRequest}`;
    return code;
}
exports.default = mockTemp;
