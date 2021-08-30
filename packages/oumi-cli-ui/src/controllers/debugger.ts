import { URL } from 'url';
import { createId } from '../utils';
import { fetch } from '@oumi/cli-shared-utils';
import type { Context } from '../../typings';

const runFetch = () => {};

const onSaveOne = async (ctx: Context) => {
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

  const writeData: any = {
    url,
    title: url.startsWith('http') ? new URL(url).pathname : url,
    key: createId(10),
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

  const res = await ctx.model.debugger.saveOne(writeData);
  return ctx.returnSuccess(res);
};

const getList = async (ctx: Context) => {
  const res = ctx.model.debugger.getList();
  return ctx.returnSuccess(res);
};

const removeOne = async (ctx: Context) => {
  const { key } = ctx.request.body;
  if (!key) {
    return ctx.returnError(`参数异常`);
  }
  const res = ctx.model.debugger.removeFormList(key);
  return ctx.returnSuccess(res);
};

export default {
  'POST /api/debugger/getList': getList,
  'POST /api/debugger/remove': removeOne,
  'POST /api/debugger/save': onSaveOne
};
