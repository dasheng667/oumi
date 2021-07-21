import React, { useState, useCallback, useEffect } from 'react';
import request from '../request';

type Options = {
  methods?: 'get' | 'post';
  params?: any;
  /** 默认不加载 */
  lazy?: boolean;

  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
};

/**
 * useRequest
 * @param Options
 * @returns
 */
export const useRequest = <T>(url: string, options?: Options) => {
  const { params, methods = 'post', lazy = false, onSuccess, onError } = options || {};
  const [flag, setFlag] = useState(lazy);

  const [error, setError] = useState(null);
  const [data, setData] = useState<T>(null as any);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    (urlParams?: any, options2?: any) => {
      setLoading(true);
      return new Promise((resolve, reject) => {
        request[methods](url, { ...params, ...urlParams })
          .then((res: any) => {
            setLoading(false);
            setData(res);
            if (typeof onSuccess === 'function') {
              onSuccess(res);
            }
            if (options2 && typeof options2.onSuccess === 'function') {
              options2.onSuccess(res);
            }
            resolve(res);
          })
          .catch((err) => {
            setLoading(false);
            setError(err);
            if (typeof onError === 'function') {
              onError(err);
            }
            if (options2 && typeof options2.onError === 'function') {
              options2.onError(err);
            }
            reject(err);
          });
      });
    },
    [params]
  );

  // 参数变更就重新请求接口
  useEffect(() => {
    if (flag === false) {
      fetch();
    }
    setFlag(true);
  }, [fetch, flag, params]);

  return {
    error,
    data,
    loading,
    request: fetch
  };
};
