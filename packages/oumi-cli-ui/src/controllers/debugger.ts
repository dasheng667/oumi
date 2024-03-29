/* eslint-disable no-underscore-dangle */
import querystring from 'qs';
import { fetch } from '@oumi/cli-shared-utils';
import { urlStringify, getRequestContent, getAssertResult } from '../connectors/debugger';
import type { Context } from '../typings';

const getList = async (ctx: Context) => {
  const res = ctx.model.debugger.getList();
  return ctx.returnSuccess(res);
};

const removeNode = async (ctx: Context) => {
  const { key } = ctx.request.body;
  if (!key) {
    return ctx.returnError(`参数异常`);
  }
  const res = ctx.model.debugger.removeByKey(key);
  return ctx.returnSuccess(res);
};

/** 一个任务的详情数据 */
const taskDetail = async (ctx: Context) => {
  const { key, pkey } = ctx.request.body;
  if (!key) {
    return ctx.returnError(`参数异常`);
  }
  if (key === '1') return ctx.returnSuccess({});

  const find = ctx.model.debugger.findByKey(key);
  let res = { ...find };

  if (pkey) {
    const parent = ctx.model.debugger.findByKey(pkey);
    // 测试用例的url需要替换成父级的
    if (parent && !parent.isTest) {
      res = {
        ...res,
        url: parent.url,
        method: parent.method
      };
    }
  }

  return ctx.returnSuccess(res);
};

/** 执行一个请求任务 */
const runTask = async (ctx: Context) => {
  const { env, url, request, key, requestPost } = ctx.request.body;
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
      'User-Agent': `oumi-cli`,
      Accept: '*/*',
      'Cache-Control': 'no-cache',
      Host: ctx.request.headers.host,
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      ...headers
    };

    const result = {
      body,
      method,
      isJSON,
      fetchUrl,
      requestHeader,
      timer: endTime - startTime,
      statusText: res.statusText,
      status: res.status,
      header: res.headers.raw(),
      assertResult: getAssertResult(body, requestPost)
    };
    return ctx.returnSuccess(result);
  } catch (e) {
    return ctx.returnError(e);
  }
};

/** 创建一个测试用例 */
const createTestExample = (ctx: Context) => {
  const { title, pkey } = ctx.request.body;
  if (!title) {
    return ctx.returnError('title error');
  }
  if (!pkey) {
    return ctx.returnError('pkey error');
  }

  const findParent: any = ctx.model.debugger.findByKey(pkey);

  if (findParent) {
    try {
      const deep = JSON.stringify(findParent);
      const parse = JSON.parse(deep);
      // 新的子节点
      const node = {
        pkey,
        title,
        url: null,
        request: parse.request,
        requestPost: parse.requestPost,
        isLeaf: true,
        isTest: true,
        _mid: findParent._mid
      };
      const res = ctx.model.debugger.pushNode(node);
      return ctx.returnSuccess(res);
    } catch (e) {
      return ctx.returnError(e);
    }
  }

  return ctx.returnError(`not find key ${pkey}`);
};

/** 保存一个任务 */
const onSaveTask = async (ctx: Context) => {
  const data = await ctx.model.projectList.findCurrent();
  if (!data) {
    return ctx.returnError(`项目数据异常`);
  }
  const { env, method, url, request, group, key, requestPost, isTest } = ctx.request.body;

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

  // 测试用例不能覆盖 url, method等参数
  const writeData = {
    url: isTest ? null : url,
    env: isTest ? null : env,
    method: isTest ? null : method,
    group,
    request,
    requestPost
  };

  if (key) {
    const ues = await ctx.model.debugger.updateByKey(key, writeData);
    return ctx.returnSuccess(ues);
  }

  const res = await ctx.model.debugger.pushNode(writeData);
  return ctx.returnSuccess(res);
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
  'POST /api/debugger/getList': getList,
  'POST /api/debugger/remove': removeNode,
  'POST /api/debugger/saveTask': onSaveTask,
  'POST /api/debugger/runTask': runTask,
  'POST /api/debugger/taskDetail': taskDetail,
  'POST /api/debugger/creatTestExp': createTestExample,

  'POST /api/debugger/getGlobalVar': getGlobalVar,
  'POST /api/debugger/saveGlobalVar': saveGlobalVar,
  'POST /api/debugger/getCurrentEnv': getCurrentEnv,
  'POST /api/debugger/toggleEnv': toggleEnv
};
