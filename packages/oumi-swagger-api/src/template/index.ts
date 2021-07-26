import { stringCase, dataType } from '../utils';

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
  let str = `export type ${stringCase(name)} = { \n`;
  interArr.forEach((key: any) => {
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

const getNameSpace = (namespace: string) => {
  if (namespace) {
    return `${stringCase(namespace)}.`;
  }
  return '';
};

const getFunExportNameSpace = (namespace: string) => {
  if (namespace) {
    return `export const ${namespace} = `;
  }
  return 'export default ';
};

export const requestTemp = (options: {
  method: string;
  url: string;
  params?: any;
  fileType?: 'js' | 'ts';
  namespace?: string;
}) => {
  const { method = 'GET', url, params, fileType, namespace = '' } = options;
  if (fileType === 'ts') {
    return `${getFunExportNameSpace(namespace)}(params: ${getNameSpace(
      namespace
    )}Props, options?: {[key: string]: any}) => {
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

export const namespaceTempHead = (name: string) => {
  return `\n
export declare namespace ${stringCase(name)} { \n`;
};

export const namespaceTempFoot = `} \n`;

export const mockJSTemp = () => {};
