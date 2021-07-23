"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockJSTemp = exports.namespaceTempFoot = exports.namespaceTempHead = exports.requestTemp = exports.interfaceTemp = void 0;
const utils_1 = require("../utils");
function getType(value) {
    const { type } = value;
    if (typeof type === 'string' && type.indexOf('int') > -1)
        return 'number';
    if (type === 'integer')
        return 'number';
    if (type === 'file')
        return 'any';
    if (type === 'ref')
        return 'any';
    return type;
}
function getInterfaceType(value) {
    const { items } = value;
    const type = getType(value);
    if (type === 'array' && items && items.type) {
        return `${getType(items)}[]`;
    }
    if (utils_1.dataType.includes(type)) {
        return type;
    }
    if (type) {
        return utils_1.stringCase(type);
    }
    return 'any';
}
// 主要兼容 name 存在'-'的情况
function getInterfaceName(name) {
    if (typeof name === 'string' && name.indexOf('-') > -1) {
        return `'${name}'`;
    }
    return name;
}
/**
 * ts接口模板
 * @param name interface的名称
 * @param data
 * @returns
 */
exports.interfaceTemp = (name, data) => {
    const interArr = Object.keys(data);
    if (interArr.length === 0) {
        return `export type ${utils_1.stringCase(name)} = null; \n`;
    }
    let str = `export type ${utils_1.stringCase(name)} = { \n`;
    interArr.forEach((key) => {
        const val = data[key];
        const kname = val.name || key || '';
        const description = val.description
            ? `  /** 备注：${val.description} ${val.example ? `示例：${val.example}` : ''} */ \n`
            : '';
        const content = ` ${getInterfaceName(kname)}${val.required === false ? '?' : ''}: ${getInterfaceType(val)}; \n`;
        str += description;
        str += content;
    });
    str += '} \n\n';
    return str;
};
const getNameSpace = (namespace) => {
    if (namespace) {
        return `${utils_1.stringCase(namespace)}.`;
    }
    return '';
};
const getFunExportNameSpace = (namespace) => {
    if (namespace) {
        return `export const ${namespace} = `;
    }
    return 'export default ';
};
exports.requestTemp = (options) => {
    const { method = 'GET', url, params, fileType, namespace = '' } = options;
    if (fileType === 'ts') {
        return `${getFunExportNameSpace(namespace)}(params: ${getNameSpace(namespace)}Props, options?: {[key: string]: any}) => {
  return request<${getNameSpace(namespace)}Result>({
    url: '${url}',
    methods: '${method.toLocaleUpperCase()}',
    data: params,
    ...(options || {})
  })
} \n`;
    }
    return `export default function(params, options){
  return request({
    url: '${url}',
    methods: '${method.toLocaleUpperCase()}',
    data: params,
    ...(options || {})
  })
} \n`;
};
exports.namespaceTempHead = (name) => {
    return `\n
export declare namespace ${utils_1.stringCase(name)} { \n`;
};
exports.namespaceTempFoot = `} \n`;
exports.mockJSTemp = () => {
};
