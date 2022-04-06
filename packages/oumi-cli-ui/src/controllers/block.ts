import fs from 'fs';
// import fetch from '../utils/fetch';
import GitUrlParse from 'git-url-parse';
import { getBlockListFromGit, downloadFileToLocal, getBlockListFromGitLab, queryRepositoryFile } from '@oumi/block-sdk';
import type { Context } from '../typings';

/**
 * 资产控制器
 * @param {*} ctx
 * @returns
 */

const isGitLab = (url) => {
  return url.indexOf('github') === -1;
};

const getUserBlockList = (ctx: Context) => {
  const data: any[] = ctx.model.userBlocks.get() || [];
  return ctx.returnSuccess(data.sort((a, b) => (a.order > b.order ? 1 : -1)));
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

const getBlocks = async (ctx: Context) => {
  const { url, useBuiltJSON = true } = ctx.request.body;
  try {
    if (isGitLab(url)) {
      const data = await getBlockListFromGitLab(url);
      return ctx.returnSuccess(data);
    }
    return await getBlockListFormGit(ctx);
  } catch (e) {
    return ctx.returnError(e);
  }
};

const getRepositoryFile = async (ctx: Context) => {
  const { url } = ctx.request.body;
  const is = isGitLab(url);
  const res = await queryRepositoryFile(url, { isGitLab: is });
  ctx.returnSuccess(res);
};

const downloadFile = async (ctx: Context) => {
  const { destPath, path, url, projectId } = ctx.request.body;

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
    const data: any = await downloadFileToLocal(url, destPath, { path, projectId, recursive: true, downloadSource: 'api', token });
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

  // 'POST /api/block/getListFormGit': getBlockListFormGit,
  'POST /api/block/getBlocks': getBlocks,
  'POST /api/block/getFileContent': getRepositoryFile,

  'POST /api/block/downloadFile': downloadFile
};
