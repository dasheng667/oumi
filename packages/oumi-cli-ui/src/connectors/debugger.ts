/* eslint-disable eqeqeq */
import jp from 'jsonpath';
import querystring from 'qs';

interface IAssertItem {
  key: string;
  type: 'assert';
  name: string;
  assertObject: string;
  expression: string;
  assertEnumKey: string;
  assertValue: string;
}

export const assertObject = [{ name: 'Response JSON', value: '1' }];

export const assertSelect = [
  { name: '必需存在', value: 'required', handler: (v1) => !!v1 },
  { name: '等于', value: 'eq', handler: (v1, v2) => v1 == v2 },
  { name: '不等于', value: 'neq', handler: (v1, v2) => v1 != v2 },
  // { name: '不存在', value: 'nexist', handler: (v1, v2) => v1 == v2 },
  { name: '小于', value: 'lt', handler: (v1, v2) => v1 < v2 },
  { name: '小于或等于', value: 'lte', handler: (v1, v2) => v1 <= v2 },
  { name: '大于', value: 'gt', handler: (v1, v2) => v1 > v2 },
  { name: '大于或等于', value: 'gte', handler: (v1, v2) => v1 >= v2 },
  { name: '包含', value: 'include', handler: (v1, v2) => (typeof v1 === 'string' ? v1.indexOf(v2) > -1 : null) },
  { name: '不包含', value: 'ninclude', handler: (v1, v2) => (typeof v1 === 'string' ? v1.indexOf(v2) == -1 : null) },
  { name: '为空', value: 'empty', handler: (v1) => !v1 }
];

export const urlStringify = (url: string, query: object) => {
  let fetchUrl = url;
  const index = fetchUrl.indexOf('?');
  let urlParams = '';
  if (index > -1) {
    urlParams = fetchUrl.substr(index + 1);
    fetchUrl = fetchUrl.substr(0, index);
  }
  const paramsData = querystring.parse(urlParams) || null;
  if (urlParams && paramsData) {
    fetchUrl += `?${querystring.stringify({ ...paramsData, ...query })}`;
  } else {
    fetchUrl += `${fetchUrl.indexOf('?') > -1 ? '' : '?'}${querystring.stringify({ ...query })}`;
  }
  return fetchUrl;
};

export const getRequestContent = (arr: any[]) => {
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

const handlerAssert = (key: string, v1: any, v2: any) => {
  const find = assertSelect.find((v) => v.value === key);
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

/**
 *
 * @param body fetch的body
 * @param assertList 断言用例
 * @returns
 */
export const getAssertResult = (body: any, assertList: IAssertItem[]) => {
  if (!body || !assertList || typeof body !== 'object' || !Array.isArray(assertList)) return null;

  const result = [];

  assertList.forEach((v) => {
    const { expression, assertEnumKey, assertValue, name } = v;
    if (expression) {
      const e1 = jp.value(body, expression);
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
