"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * 模拟数据转typescript
 * 将多层数据嵌套扁平化处理
 * @param data
 * @returns
 */
function toTypeScript(data, interfaceName = 'props') {
    const result = {};
    const props = {};
    result[interfaceName] = props;
    function eachValue(value) {
        const res = {};
        if (utils_1.isObject(value)) {
            Object.keys(value).forEach(key => {
                const val = { ...value[key] };
                if (val.isArray) {
                    res[key] = {
                        type: `${key}[]`
                    };
                    delete val.isArray;
                    result[key] = val;
                }
                else if (utils_1.verifyNodeIsDeclarationType(val)) {
                    res[key] = val;
                }
                else {
                    res[key] = {
                        type: key
                    };
                    result[key] = eachValue(val);
                }
            });
        }
        else {
            console.log('数据异常1: ', value);
        }
        return res;
    }
    if (utils_1.isObject(data)) {
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value.isArray) {
                console.log('isArray: ', value);
            }
            else if (utils_1.verifyNodeIsDeclarationType(value)) {
                // 是一个正常的数据声明格式
                props[key] = value;
            }
            else {
                props[key] = {
                    type: key
                };
                result[key] = eachValue(value);
            }
        });
    }
    else {
        console.log('数据异常2: ', data);
    }
    return result;
}
exports.default = toTypeScript;
