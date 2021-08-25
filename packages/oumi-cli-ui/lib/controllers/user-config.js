'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fetch_1 = __importDefault(require('../utils/fetch'));
const getUserConfig = (ctx) => {
  const data = ctx.model.userConfig.get() || {};
  const blocks = ctx.model.userBlocks.get() || [];
  data.blocks = blocks;
  return ctx.returnSuccess(data);
};
const SwaggerAdd = async (ctx) => {
  const { name, href } = ctx.request.body;
  if (!name || typeof name !== 'string') {
    return ctx.returnError(`参数异常`);
  }
  if (!href || typeof href !== 'string') {
    return ctx.returnError(`参数异常`);
  }
  try {
    const swagger = await fetch_1.default(href);
    if (swagger && swagger.paths && swagger.definitions) {
      const data = ctx.model.userConfig.swagger.add({ name, href });
      return ctx.returnSuccess(data);
    }
    return ctx.returnError({ msg: 'swagger api的链接应包含 paths 等字段' });
  } catch (e) {
    return ctx.returnError({ msg: '请输入正确的swagger链接', data: e });
  }
};
const SwaggerRemove = (ctx) => {
  const { id } = ctx.request.body;
  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }
  const data = ctx.model.userConfig.swagger.remove(id);
  return ctx.returnSuccess(data);
};
const getConfigSwagger = (ctx) => {
  const data = ctx.model.userConfig.swagger.get();
  return ctx.returnSuccess(data);
};
const SavePrivateConfig = (ctx) => {
  const data = ctx.request.body;
  const res = ctx.model.userConfig.private.set(data);
  return ctx.returnSuccess(res);
};
exports.default = {
  'POST /api/config/get': getUserConfig,
  'POST /api/config/swagger/get': getConfigSwagger,
  'POST /api/config/swagger/add': SwaggerAdd,
  'POST /api/config/swagger/remove': SwaggerRemove,
  'POST /api/config/savePrivateConfig': SavePrivateConfig
};
