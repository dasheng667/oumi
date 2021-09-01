import querystring from 'querystring';
import pkg from '../../package.json';
import { URL } from 'url';
import { createId } from '../utils';
import { fetch } from '@oumi/cli-shared-utils';
import type { Context } from '../../typings';

// eslint-disable-next-line @typescript-eslint/ban-types
const urlStringify = (url: string, query: object) => {
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

const getRequestContent = (arr: any[]) => {
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

const onSaveOneTask = async (ctx: Context) => {
  const data = await ctx.model.projectList.findCurrent();
  if (!data) {
    return ctx.returnError(`项目数据异常`);
  }
  const { env, method, url, request, group, key } = ctx.request.body;

  if (!env) {
    return ctx.returnError('env error');
  }
  if (!method) {
    return ctx.returnError('method error');
  }
  if (!url) {
    return ctx.returnError('url error');
  }
  if (!request) {
    return ctx.returnError('request error');
  }
  /* 
    >>> ant design tree 格式
    
    title: 'parent 0',
    key: '0-0',
    group: true,
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
    ]
  */

  const isHttp = url.startsWith('http');
  let title = isHttp ? new URL(url).pathname : url;
  if (isHttp && (title === '/' || !title)) {
    // 没有pathname
    title = new URL(url).hostname;
  }
  const writeData: any = {
    url,
    title,
    env,
    method,
    group,
    request
  };

  if (key) {
    const find = await ctx.model.debugger.findListByKey(key);
    if (find) {
      const ues = await ctx.model.debugger.updateListByKey(key, writeData);
      return ctx.returnSuccess(ues);
    }
  }

  const res = await ctx.model.debugger.saveOne({ key: createId(10), ...writeData });
  return ctx.returnSuccess(res);
};

const getList = async (ctx: Context) => {
  const res = ctx.model.debugger.getList();
  return ctx.returnSuccess(res);
};

const removeOneTask = async (ctx: Context) => {
  const { key } = ctx.request.body;
  if (!key) {
    return ctx.returnError(`参数异常`);
  }
  const res = ctx.model.debugger.removeFormList(key);
  return ctx.returnSuccess(res);
};

/** 一个任务的详情数据 */
const taskDetail = async (ctx: Context) => {
  const { key } = ctx.request.body;
  if (!key) {
    return ctx.returnError(`参数异常`);
  }
  if (key === '1') return ctx.returnSuccess({});
  const res = ctx.model.debugger.findTaskDetail(key);
  return ctx.returnSuccess(res || {});
};

/** 执行一个请求任务 */
const runTask = async (ctx: Context) => {
  const { env, url, request, key } = ctx.request.body;
  let { method } = ctx.request.body;

  if (!env) {
    return ctx.returnError('env error');
  }
  if (!method) {
    return ctx.returnError('method error');
  }
  if (!url) {
    return ctx.returnError('url error');
  }
  if (!request) {
    return ctx.returnError('request error');
  }

  let fetchUrl = url;
  const startTime = Date.now();
  method = method.toLocaleUpperCase();

  try {
    // 全局参数
    const globalParams = ctx.model.debuggerGlobal.getGlobalParams();

    // 若当前url不是http开头，取全局的url前缀
    if (!fetchUrl.startsWith('http')) {
      // 当前环境的配置
      const envConfig = ctx.model.debuggerEnvList.getCurrentEnvConfig();
      if (envConfig && envConfig.url) {
        fetchUrl = envConfig.url + fetchUrl;
      }
    }

    // 合并参数
    const cookie = { ...globalParams.cookie, ...getRequestContent(request.cookie) };
    const headers = { ...globalParams.header, ...getRequestContent(request.header) };

    if (Object.keys(cookie).length > 0) {
      Object.assign(headers, { cookie: querystring.stringify(cookie) });
    }

    const options: any = {
      method,
      headers
    };
    if (method === 'POST') {
      // 合并全局参数
      const bodyFormData = { ...globalParams.bodyFormData, ...getRequestContent(request.bodyFormData) };
      const bodyJSON = { ...getRequestContent(request.bodyJSON) };
      // 优先 form data
      const reqBody = Object.keys(bodyFormData).length > 0 ? JSON.stringify(bodyFormData) : bodyJSON;

      Object.assign(options, { body: reqBody });
    } else if (method === 'GET') {
      // 处理 get 的url
      const query = { ...globalParams.query, ...getRequestContent(request.query) };
      fetchUrl = urlStringify(fetchUrl, query);
    }

    const res = await fetch(fetchUrl, options);
    const endTime = Date.now();

    // console.log('res', url, method, res)
    let isJSON = false;
    let body = await res.text();
    if (typeof body === 'string' && body.startsWith('{') && body.endsWith('}')) {
      isJSON = true;
      body = JSON.parse(body);
    }

    const requestHeader = {
      'User-Agent': `${pkg.name}/${pkg.version}`,
      Accept: '*/*',
      'Cache-Control': 'no-cache',
      Host: ctx.request.headers.host,
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      ...headers
    };

    return ctx.returnSuccess({
      timer: endTime - startTime,
      statusText: res.statusText,
      status: res.status,
      header: res.headers.raw(),
      requestHeader,
      body,
      isJSON
    });
  } catch (e) {
    return ctx.returnError(e);
  }
};

/** 获取全局变量 */
const getGlobalVar = (ctx: Context) => {
  const res1 = ctx.model.debuggerGlobal.getList();
  const res2 = ctx.model.debuggerEnvList.getList();
  return ctx.returnSuccess({
    global: res1,
    envList: res2
  });
};

/** 保存全局变量 */
const saveGlobalVar = (ctx: Context) => {
  const { type, data, form } = ctx.request.body;

  if (!type) {
    return ctx.returnError('type error');
  }
  if (!data) {
    return ctx.returnError('data error');
  }

  // 环境变量
  if (type === 'envList') {
    if (!form || !form.env) {
      return ctx.returnError('form error');
    }
    const res = ctx.model.debuggerEnvList.save(form.env, {
      data,
      form
    });
    return ctx.returnSuccess(res);
  }

  const res = ctx.model.debuggerGlobal.save({
    type,
    data,
    form
  });
  return ctx.returnSuccess(res);
};

/** 切换环境变量 */
const toggleEnv = (ctx: Context) => {
  const { env } = ctx.request.body;

  if (!env) {
    return ctx.returnError('env error');
  }

  const res = ctx.model.debuggerEnvList.setCurrentEnv(env);
  return ctx.returnSuccess(res);
};

const getCurrentEnv = (ctx: Context) => {
  const res = ctx.model.debuggerEnvList.getCurrentEnv();
  return ctx.returnSuccess(res);
};

export default {
  'POST /api/debugger/taskDetail': taskDetail,
  'POST /api/debugger/getList': getList,
  'POST /api/debugger/remove': removeOneTask,
  'POST /api/debugger/save': onSaveOneTask,
  'POST /api/debugger/runTask': runTask,

  'POST /api/debugger/getGlobalVar': getGlobalVar,
  'POST /api/debugger/saveGlobalVar': saveGlobalVar,
  'POST /api/debugger/getCurrentEnv': getCurrentEnv,
  'POST /api/debugger/toggleEnv': toggleEnv
};
