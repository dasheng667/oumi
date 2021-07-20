"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.transformPath = exports.stringCase = exports.isObject = exports.findResponseRef = exports.verifyNodeIsDeclarationType = exports.dataType = exports.validataQuery = void 0;
const chalk_1 = __importDefault(require("chalk"));
const validataQuery = function (requestData, requestPath, options) {
    const { tags, description } = requestData;
    const { keyword, tag, path } = options;
    if (keyword && description.indexOf(keyword) == -1) {
        return false;
    }
    if (typeof path === 'string' && requestPath.indexOf(path) == -1) {
        return false;
    }
    if (Array.isArray(path) && path.every(p => requestPath.indexOf(p) == -1)) {
        return false;
    }
    if (tag && Array.isArray(tags)) {
        return tags.some((tag) => {
            return tag.toLocaleUpperCase().indexOf(tag.toLocaleUpperCase()) === -1;
        });
    }
    return true;
};
exports.validataQuery = validataQuery;
exports.dataType = ['string', 'number', 'array', 'object', 'integer', 'boolean'];
/**
 * 校验节点是不是声明类型，声明数据必有type
 * @param node 节点
 * @returns
 */
function verifyNodeIsDeclarationType(node) {
    if (!node || node.type === undefined)
        return false;
    return exports.dataType.includes(node.type);
}
exports.verifyNodeIsDeclarationType = verifyNodeIsDeclarationType;
function findResponseRef(request) {
    try {
        const { responses: { '200': { schema: { '$ref': ref } } } } = request;
        return ref;
    }
    catch (e) {
        // console.error(e)
    }
    return null;
}
exports.findResponseRef = findResponseRef;
function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
}
exports.isObject = isObject;
function stringCase(str) {
    if (typeof str !== 'string')
        return '';
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
exports.stringCase = stringCase;
/**
 * 把路径拼装成驼峰式 文件名 transform
 * @param path 需要转换的路径
 * @param filterPrefix 需要过滤的前缀
 * @returns
 */
function transformPath(path, filterPrefix = '') {
    let ret = path.split('/');
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
exports.transformPath = transformPath;
exports.log = {
    red(...args) {
        console.log(chalk_1.default.red(...args));
    },
    blue(...args) {
        console.log(chalk_1.default.blue(...args));
    },
    green(...args) {
        console.log(chalk_1.default.green(...args));
    },
    yellow(...args) {
        console.log(chalk_1.default.yellow(...args));
    },
    gray(...args) {
        console.log(chalk_1.default.gray(...args));
    },
};
