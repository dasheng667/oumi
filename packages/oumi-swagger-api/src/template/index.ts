import path from 'path';
import { stringCase, dataType } from '../utils';
import template from 'art-template';

const getTemplatePath = (tempName: string) => {
  return path.resolve(__dirname, '../../', 'template/', tempName);
};

function getType(value) {
  const { type } = value;
  if (typeof type === 'string' && type.indexOf('int') > -1) return 'number';
  if (type === 'integer') return 'number';
  if (type === 'file') return 'any';
  if (type === 'ref') return 'any';
  return type;
}

function getInterfaceType(value) {
  const { items } = value;
  const type = getType(value);

  if (type === 'any') {
    return 'any';
  }
  if (type === 'array' && items && items.type) {
    return `${getType(items)}[]`;
  }
  if (dataType.includes(type)) {
    return type;
  }
  if (type) {
    return stringCase(type);
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
export const interfaceTemp = (name: string, data: any) => {
  const interArr = Object.keys(data);
  if (interArr.length === 0) {
    return `export type ${stringCase(name)} = null; \n`;
  }
  const p = getTemplatePath('ts-type.art');
  return template(p, {
    list: data,
    name: stringCase(name),
    getInterfaceType,
    getInterfaceName
  });
  // let str = `export type ${stringCase(name)} = { \n`;
  // interArr.forEach((key: any) => {
  //   const val = data[key];
  //   const kname = val.name || key || '';
  //   const description = val.description ? `  /** 备注：${val.description} ${val.example ? `示例：${val.example}` : ''} */ \n` : '';
  //   const content = ` ${getInterfaceName(kname)}${val.required === false ? '?' : ''}: ${getInterfaceType(val)}; \n`;
  //   str += description;
  //   str += content;
  // });
  // str += '} \n\n';
  // return str;
};

const getNameSpace = (namespace: string) => {
  if (namespace) {
    return `${stringCase(namespace)}`;
  }
  return '';
};

const getFunExportNameSpace = (namespace: string) => {
  if (namespace) {
    return `export const ${namespace} = `;
  }
  return 'export default ';
};

const objectToString = (params: object) => {
  let str = '';
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((k, i) => {
      if (i !== 0) {
        str += '\n';
      }
      str += ` ${k}: ${params[k]}`;
    });
    str += ',';
  }
  return str;
};

export const requestTemp = (options: {
  method: string;
  url: string;
  params?: any;
  fileType?: 'js' | 'ts';
  namespace?: string;
  requestParams?: object;
}) => {
  const { method = 'GET', url, params, fileType, namespace = '', requestParams } = options;
  const p = getTemplatePath('request.art');
  const html = template(p, {
    url,
    method,
    fileType,
    namespace,
    requestParams,
    nameUpperCase: getNameSpace(namespace)
  });
  return html;
};

export const namespaceTempHead = (name: string) => {
  return `\n
export declare namespace ${stringCase(name)} { \n`;
};

export const namespaceTempFoot = `} \n`;

export const mockJSTemp = () => {};
