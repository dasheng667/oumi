export const createId = (max: number = 8, randomString?: string) => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * hexDigits.length), 1);
  }
  return s.join('');
};

const dataType = ['string', 'number', 'array', 'object', 'integer', 'boolean', 'int32', 'int64', 'ref', 'file'];

/**
 * 校验节点是不是声明类型，声明数据必有type
 * @param node 节点
 * @returns
 */
function verifyNodeIsDeclarationType(node: any) {
  if (!node || node.type === undefined) return false;
  return dataType.includes(node.type);
}

interface Options {
  /** 生成的response，其值的类型 */
  resultValueType: 'type' | 'desc';
}

/**
 * 模拟数据转response
 * @param data
 * @returns
 */
export const toResponseJSON = (resData: any, options?: Options) => {
  const result = {};
  function each(res: any, data: any) {
    if (Array.isArray(data)) {
      data.forEach((value) => {
        console.log('数组的暂没有处理~');
      });
    } else if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        const value = { ...data[key] };

        if (value.isArray) {
          delete value.isArray;
          const arrChild = {};
          each(arrChild, value);
          res[key] = [arrChild];
        } else if (verifyNodeIsDeclarationType(value)) {
          // 是一个正常的数据声明格式
          res[key] = transformDataResult(value, options);
        } else {
          if (Number(key) === 0) return; // 防止不识别的类型导致死循环
          res[key] = {};
          each(res[key], value);
        }
      });
    }
  }
  each(result, resData);
  return result;
};

const getResultDefaultVal = (data: any, defaultValue: any, options?: Options) => {
  const { resultValueType = 'type' } = options || {};
  const { explame, description } = data;
  if (resultValueType === 'type') {
    return defaultValue;
  }
  return explame || defaultValue;
};

function transformDataResult(data: any, options?: Options) {
  const { type, items, explame } = data;
  if (explame) return explame;
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
