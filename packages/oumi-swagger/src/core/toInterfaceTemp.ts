import { interfaceTemp } from '../template';

/**
 * 将数据节点转换成 ts 接口文件
 * @param data
 * @returns
 */
export default function toInterfaceTemp(data: any): string {
  let str = '';
  Object.keys(data).forEach((key) => {
    const val = data[key];
    str += interfaceTemp(key, val);
  });
  return str;
}
