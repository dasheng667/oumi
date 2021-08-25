import fs from 'fs';
// import fetch from '../utils/fetch';
import GitUrlParse from 'git-url-parse';
import { getBlockListFromGit, downloadFileToLocal } from '@oumi/block-sdk';
import type { Context } from '../../typings';

/**
 * 资产控制器
 * @param {*} ctx
 * @returns
 */

const getUserBlockList = (ctx: Context) => {
  const data = ctx.model.userBlocks.get();
  return ctx.returnSuccess(data || []);
};

const pushBlockItem = (ctx: Context) => {
  const { name, href } = ctx.request.body;

  if (!name || typeof name !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  if (!href || typeof href !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const { resource } = GitUrlParse(href) || {};

  if (resource !== 'github.com') {
    return ctx.returnError(`目前只支持 github 项目`);
  }

  if (!href.endsWith('.json')) {
    return ctx.returnError(`资产链接必须是json后缀`);
  }

  const data = ctx.model.userBlocks.add({ name, href });
  return ctx.returnSuccess(data);
};

const removeBlockItem = (ctx: Context) => {
  const { id } = ctx.request.body;

  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const res = ctx.model.userBlocks.remove(id);
  return ctx.returnSuccess(res);
};

const getBlockListFormGit = async (ctx: Context) => {
  const { url, useBuiltJSON = true } = ctx.request.body;

  if (!url || typeof url !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  try {
    const data = await getBlockListFromGit(url, { useBuiltJSON });
    if (data && data.list) {
      return ctx.returnSuccess(data.list);
    }
    return ctx.returnError('blocks格式错误');
  } catch (e) {
    return ctx.returnError(e);
  }
};

const downloadFile = async (ctx: Context) => {
  const { destPath, url } = ctx.request.body;

  if (!destPath || typeof destPath !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  if (!fs.existsSync(destPath)) {
    return ctx.returnError(`必须是一个有效的目录`);
  }

  try {
    const config = ctx.model.userConfig.private.get();
    let token = '';
    if (config && config.access_token) {
      token = config.access_token;
    }
    const data: any = await downloadFileToLocal(url, destPath, { recursive: true, downloadSource: 'api', token });
    return ctx.returnSuccess(data);
  } catch (e) {
    if (typeof e === 'string' && e.indexOf('API rate limit exceeded') > -1) {
      return ctx.returnError({ msg: '因 github api 有下载次数限制，可配置 access_token 无限制下载！！！', code: 999 });
    }
    return ctx.returnError(e);
  }
};

export default {
  'POST /api/block/getList': getUserBlockList,
  'POST /api/block/pushItem': pushBlockItem,
  'POST /api/block/removeItem': removeBlockItem,

  'POST /api/block/getListFormGit': getBlockListFormGit,

  'POST /api/block/downloadFile': downloadFile
};
