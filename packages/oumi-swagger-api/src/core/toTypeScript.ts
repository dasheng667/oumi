import { verifyNodeIsDeclarationType, isObject } from '../utils';

/**
 * 模拟数据转typescript
 * 将多层数据嵌套扁平化处理
 * @param data
 * @returns
 */
export default function toTypeScript(data: any, interfaceName: string = 'props') {
  const result = {} as any;
  const props = {};
  result[interfaceName] = props;

  function eachValue(value: any) {
    const res = {};
    if (isObject(value)) {
      Object.keys(value).forEach((key) => {
        const val = { ...value[key] };
        if (val.isArray) {
          res[key] = {
            type: `${key}[]`
          };
          delete val.isArray;
          result[key] = val;
        } else if (verifyNodeIsDeclarationType(val)) {
          res[key] = val;
        } else {
          if (Number(key) === 0) return; // 防止不识别的类型导致死循环
          res[key] = {
            type: key
          };
          result[key] = eachValue(val);
        }
      });
    } else {
      console.log('数据异常1: ', value);
    }
    return res;
  }

  if (isObject(data)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value.isArray) {
        console.log('toTypeScript.isArray: ', value);
      } else if (verifyNodeIsDeclarationType(value)) {
        // 是一个正常的数据声明格式
        props[key] = value;
      } else {
        props[key] = {
          type: key
        };
        result[key] = eachValue(value);
      }
    });
  } else {
    console.log('数据异常2: ', data);
  }

  return result;
}
