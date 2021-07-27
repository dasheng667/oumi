"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMockStr = exports.mockExportFooterTemp = exports.mockExportHeaderTemp = void 0;
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
const eachMockTemp = function (data) {
    const resultData = {};
    const deep = (deepData, res) => {
        if (utils_1.dataType.indexOf(deepData.type)) {
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
exports.buildMockStr = function (data) {
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
                const mockVal = getMockValue(item);
                const description = item.description ? `${space(level)} /** ${item.description} */` : '';
                itemStr += `${description} \n ${space(level)}'${mockKey}': ${mockVal}, \n`;
            }
        });
        return itemStr;
    }
    return `{ \n ${deep(data, 0)} } \n `;
};
function mockTemp(apiPath, methods, response) {
    const funName = utils_1.transformPath(apiPath).key;
    // const mockContent = eachMockTemp(response && response.code && response.data ? response.data : response);
    const mockContent = exports.buildMockStr(response && response.code && response.data ? response.data : response);
    const mockRequest = `function ${funName}(req: Request, res: Response, u: string){
  const data = ${mockContent};
  return res.send({ code: 200, data, success: true });
}, \n\n\n`;
    const code = `"${methods.toLocaleUpperCase()} ${apiPath}": ${mockRequest}`;
    return code;
}
exports.default = mockTemp;
