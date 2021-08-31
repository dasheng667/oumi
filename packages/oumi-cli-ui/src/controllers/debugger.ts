import querystring from 'querystring';
import pkg from '../../package.json';
import { URL } from 'url';
import { createId } from '../utils';
import { fetch } from '@oumi/cli-shared-utils';
import type { Context } from '../../typings';

const runFetch = () => {};

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

/** 执行一个请求任务 */
const runTask = async (ctx: Context) => {
  const { env, method, url, request, key } = ctx.request.body;

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
  try {
    const headers = getRequestContent(request.header);
    const query = getRequestContent(request.query);
    const bodyFormData = getRequestContent(request.bodyFormData);
    const options: any = {
      method,
      headers
    };
    if (method.toLocaleUpperCase() === 'POST') {
      Object.assign(options, { body: bodyFormData });
    } else {
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
      // console.log('fetchUrl:', fetchUrl);
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

export default {
  'POST /api/debugger/taskDetail': taskDetail,
  'POST /api/debugger/getList': getList,
  'POST /api/debugger/remove': removeOneTask,
  'POST /api/debugger/save': onSaveOneTask,
  'POST /api/debugger/runTask': runTask
};
