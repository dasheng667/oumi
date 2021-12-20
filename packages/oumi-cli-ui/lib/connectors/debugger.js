"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssertResult = exports.getRequestContent = exports.urlStringify = exports.assertSelect = exports.assertObject = void 0;
const jsonpath_1 = __importDefault(require("jsonpath"));
const qs_1 = __importDefault(require("qs"));
exports.assertObject = [{ name: 'Response JSON', value: '1' }];
exports.assertSelect = [
    { name: '必需存在', value: 'required', handler: (v1) => !!v1 },
    { name: '等于', value: 'eq', handler: (v1, v2) => v1 == v2 },
    { name: '不等于', value: 'neq', handler: (v1, v2) => v1 != v2 },
    { name: '小于', value: 'lt', handler: (v1, v2) => v1 < v2 },
    { name: '小于或等于', value: 'lte', handler: (v1, v2) => v1 <= v2 },
    { name: '大于', value: 'gt', handler: (v1, v2) => v1 > v2 },
    { name: '大于或等于', value: 'gte', handler: (v1, v2) => v1 >= v2 },
    { name: '包含', value: 'include', handler: (v1, v2) => (typeof v1 === 'string' ? v1.indexOf(v2) > -1 : null) },
    { name: '不包含', value: 'ninclude', handler: (v1, v2) => (typeof v1 === 'string' ? v1.indexOf(v2) == -1 : null) },
    { name: '为空', value: 'empty', handler: (v1) => !v1 }
];
exports.urlStringify = (url, query) => {
    let fetchUrl = url;
    const index = fetchUrl.indexOf('?');
    let urlParams = '';
    if (index > -1) {
        urlParams = fetchUrl.substr(index + 1);
        fetchUrl = fetchUrl.substr(0, index);
    }
    const paramsData = qs_1.default.parse(urlParams) || null;
    if (urlParams && paramsData) {
        fetchUrl += `?${qs_1.default.stringify({ ...paramsData, ...query })}`;
    }
    else {
        fetchUrl += `${fetchUrl.indexOf('?') > -1 ? '' : '?'}${qs_1.default.stringify({ ...query })}`;
    }
    return fetchUrl;
};
exports.getRequestContent = (arr) => {
    if (Array.isArray(arr)) {
        const res = {};
        arr.forEach((item) => {
            if (item.name) {
                res[item.name] = item.value;
            }
        });
        return res;
    }
    return null;
};
const handlerAssert = (key, v1, v2) => {
    const find = exports.assertSelect.find((v) => v.value === key);
    if (find) {
        const res = find.handler(v1, v2);
        return {
            name: find.name,
            success: res
        };
    }
    return {
        success: false
    };
};
exports.getAssertResult = (body, assertList) => {
    if (!body || !assertList || typeof body !== 'object' || !Array.isArray(assertList))
        return null;
    const result = [];
    assertList.forEach((v) => {
        const { expression, assertEnumKey, assertValue, name } = v;
        if (expression) {
            const e1 = jsonpath_1.default.value(body, expression);
            const res = handlerAssert(assertEnumKey, e1, assertValue);
            result.push({
                name: name || `${expression} ${res.name || ''} ${assertValue}`,
                success: res.success,
                assertEnumKey,
                assertValue
            });
        }
    });
    return result;
};
