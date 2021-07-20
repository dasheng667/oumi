"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * 模拟数据转response
 * @param data
 * @returns
 */
function toResponseJSON(resData) {
    const result = {};
    function each(res, data) {
        if (Array.isArray(data)) {
            data.forEach((value) => {
                console.log('数组的暂没有处理~');
            });
        }
        else if (data && typeof data === 'object') {
            Object.keys(data).forEach((key) => {
                const value = { ...data[key] };
                if (value.isArray) {
                    delete value.isArray;
                    res[key] = [value];
                }
                else if (utils_1.verifyNodeIsDeclarationType(value)) {
                    // 是一个正常的数据声明格式
                    res[key] = transformDataResult(value);
                }
                else {
                    res[key] = {};
                    each(res[key], value);
                }
            });
        }
    }
    each(result, resData);
    return result;
}
exports.default = toResponseJSON;
function transformDataResult(data) {
    const { type, items, explame } = data;
    if (explame)
        return explame;
    const typeName = items && items.type ? items.type : type;
    if (type === 'array') {
        if (typeName === 'integer' || typeName === 'number') {
            return [1];
        }
        if (typeName === 'string') {
            return ['1'];
        }
    }
    if (type === 'integer' || type === 'number') {
        return 1;
    }
    if (type === 'string') {
        return 'string';
    }
    if (type === 'boolean') {
        return true;
    }
    return type;
}
