const fs = require('fs');
const { request } = require('@oumi/cli-shared-utils');

/**
 * 资产控制器
 * @param {*} ctx
 * @returns
 */

const SearchNpmPackage = async (ctx) => {
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
    return ctx.returnError({ msg: e.msg });
  }
};

module.exports = {
  'POST /api/npm/search': SearchNpmPackage
};
