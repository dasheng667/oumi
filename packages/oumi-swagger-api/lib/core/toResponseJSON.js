"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * 模拟数据转response
 * @param data
 * @returns
 */
function toResponseJSON(resData, options) {
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
                    const arrChild = {};
                    each(arrChild, value);
                    res[key] = [arrChild];
                }
                else if ((0, utils_1.verifyNodeIsDeclarationType)(value)) {
                    // 是一个正常的数据声明格式
                    res[key] = transformDataResult(value, options);
                }
                else {
                    if (Number(key) === 0)
                        return; // 防止不识别的类型导致死循环
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
const getResultDefaultVal = (data, defaultValue, options) => {
    const { resultValueType = 'type' } = options || {};
    const { explame, description } = data;
    if (resultValueType === 'type') {
        return defaultValue;
    }
    return explame || description || defaultValue;
};
function transformDataResult(data, options) {
    const { type, items, explame } = data;
    if (explame)
        return explame;
    const typeName = items && items.type ? items.type : type;
    if (type === 'array') {
        if (typeName === 'integer' || typeName === 'number') {
            return getResultDefaultVal(data, [1], options);
        }
        if (typeName === 'string') {
            return getResultDefaultVal(data, ['1'], options);
        }
    }
    if (type === 'integer' || type === 'number') {
        return getResultDefaultVal(data, 1, options);
    }
    if (type === 'string') {
        return getResultDefaultVal(data, 'string', options);
    }
    if (type === 'boolean') {
        return getResultDefaultVal(data, true, options);
    }
    return getResultDefaultVal(data, type, options);
}
