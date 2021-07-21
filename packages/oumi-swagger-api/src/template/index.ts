import { stringCase, dataType } from '../utils';

function getType(value) {
  const { type } = value;
  if (type === 'integer') return 'number';
  if (type === 'file') return 'any';
  if (type === 'ref') return 'any';
  return type;
}

function getInterfaceType(value) {
  const { items } = value;
  const type = getType(value);

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
    const content = ` ${kname}${val.required === false ? '?' : ''}: ${getInterfaceType(val)}; \n`;
    str += description;
    str += content;
  });
  str += '} \n\n';
  return str;
};

export const requestTemp = (options: { method: string; url: string; params?: any; fileType?: 'js' | 'ts' }) => {
  const { method = 'GET', url, params, fileType } = options;
  if (fileType === 'ts') {
    return `export default function(params: Props, options?: {[key: string]: any}){
  return request<Result>({
    url: '${url}',
    methods: '${method.toLocaleUpperCase()}',
    data: params,
    ...(options || {})
  })
}`;
  }

  return `export default function(params, options){
  return request({
    url: '${url}',
    methods: '${method.toLocaleUpperCase()}',
    data: params,
    ...(options || {})
  })
}`;
};
