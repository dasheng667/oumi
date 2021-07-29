const fetch = require('../utils/fetch');
const GitUrlParse = require('git-url-parse');
const { getBlockListFromGit } = require('@oumi/block-sdk');

/**
 * 资产控制器
 * @param {*} ctx
 * @returns
 */

const getUserBlockList = (ctx) => {
  const data = ctx.model.userConfig.block.get();
  return ctx.returnSuccess(data || []);
};

const pushBlockItem = (ctx) => {
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

  const data = ctx.model.userConfig.block.add({ name, href });
  return ctx.returnSuccess(data);
};

const removeBlockItem = (ctx) => {
  const { id } = ctx.request.body;

  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const res = ctx.model.userConfig.block.remove(id);
  return ctx.returnSuccess(res);
};

const getBlockListFormGit = async (ctx) => {
  const { url } = ctx.request.body;

  if (!url || typeof url !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  try {
    const data = await getBlockListFromGit(url, { useBuiltJSON: true });
    if (data && data.list) {
      return ctx.returnSuccess(data.list);
    }
    return ctx.returnError('blocks格式错误');
  } catch (e) {
    return ctx.returnError(e);
  }
};

module.exports = {
  'POST /api/block/getList': getUserBlockList,
  'POST /api/block/pushItem': pushBlockItem,
  'POST /api/block/removeItem': removeBlockItem,

  'POST /api/block/getListFormGit': getBlockListFormGit
};
