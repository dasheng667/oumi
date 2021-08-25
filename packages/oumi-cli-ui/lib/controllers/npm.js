'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
const SearchNpmPackage = async (ctx) => {
  const { name } = ctx.request.body;
  if (!name || typeof name !== 'string') {
    return ctx.returnError(`参数异常`);
  }
  const url = `https://www.npmjs.com/search/suggestions?q=${name}`;
  try {
    const res = await cli_shared_utils_1.request.getJSON(url);
    return ctx.returnSuccess(res);
  } catch (e) {
    console.error(e);
    return ctx.returnError({ msg: e.msg });
  }
};
exports.default = {
  'POST /api/npm/search': SearchNpmPackage
};
