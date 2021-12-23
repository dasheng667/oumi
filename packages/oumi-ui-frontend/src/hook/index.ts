import axios from 'axios';
import querystring from 'qs';
import { useState, useCallback, useEffect } from 'react';
import { useLocation as useRouterLocation, useRouteMatch as useRouterMatch } from 'react-router-dom';
import request from '../request';

export { useSocket } from './socket';
export * from './event';

type Options = {
  methods?: 'get' | 'post';
  params?: any;
  /** 默认不加载 */
  lazy?: boolean;

  errorMsg?: boolean;

  onSuccess?: <T>(res: T) => void;
  onError?: (err: any) => void;
};

type Options2<T> = {
  onSuccess?: (res: T) => void;
  onError?: (err: any) => void;
};

/**
 * useRequest
 * @param Options
 * @returns
 */
export const useRequest = <T>(url: string, options?: Options) => {
  const { params, methods = 'post', lazy = false, errorMsg = true, onSuccess, onError } = options || {};
  const [flag, setFlag] = useState(lazy);
  const [source] = useState(axios.CancelToken.source());
  const [error, setError] = useState(null);
  const [data, setData] = useState<T>(null as any);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    (urlParams?: any, options2?: Options2<T>) => {
      setLoading(true);
      return new Promise((resolve, reject) => {
        const requestParams = methods === 'post' ? { ...params, ...urlParams } : { params: { ...params, ...urlParams } };
        request[methods](url, requestParams, { errorMsg, cancelToken: source.token } as any)
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
    source,
    setData,
    loading,
    request: fetch
  };
};

export const useLocation = () => {
  const location: any = useRouterLocation();
  const match = useRouterMatch();
  Object.assign(location, match);
  location.query = querystring.parse(location.search.substr(1));
  return location;
};

interface DownloadFileOptions {
  params?: object;
  customFileName?: string;
}

export const useDownloadFile = () => {
  const downloadFile = useCallback((url: string, options?: DownloadFileOptions) => {
    const { customFileName, params } = options || {};
    const urlParams = new URLSearchParams();
    const paramsData: any = { ...params };
    Object.keys(paramsData).forEach((k) => {
      urlParams.append(k, paramsData[k]);
    });
    const exportUrl = `${url}?${urlParams.toString()}`;

    if (customFileName) {
      const aEl = document.createElement('a');
      aEl.href = exportUrl;
      aEl.download = customFileName;
      aEl.click();
    } else {
      window.location.href = exportUrl;
    }
  }, []);

  return {
    downloadFile
  };
};
