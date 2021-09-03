// import fs from 'fs';
import { request } from '@oumi/cli-shared-utils';
import type { Context } from '../../typings';

/**
 * 资产控制器
 * @param {*} ctx
 * @returns
 */

const SearchNpmPackage = async (ctx: Context) => {
  const { name } = ctx.request.body;

  if (!name || typeof name !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const url = `https://www.npmjs.com/search/suggestions?q=${name}`;
  try {
    const res = await request.getJSON(url);
    return ctx.returnSuccess(res);
  } catch (e) {
    console.error(e);
    return ctx.returnError(e);
  }
};

export default {
  'POST /api/npm/search': SearchNpmPackage
};
