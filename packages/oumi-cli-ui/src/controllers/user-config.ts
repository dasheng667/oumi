import { request } from '@oumi/cli-shared-utils';
import type { Context } from '../typings';

const getUserConfig = (ctx: Context) => {
  const data = ctx.model.userConfig.get() || {};
  const blocks = ctx.model.userBlocks.get() || [];
  const swagger = ctx.model.userConfig.swagger.get();
  return ctx.returnSuccess({ ...data, swagger, blocks });
};

const SwaggerAdd = async (ctx: Context) => {
  const { name, href } = ctx.request.body;
  if (!name || typeof name !== 'string') {
    return ctx.returnError(`参数异常`);
  }
  if (!href || typeof href !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  try {
    const swagger: any = await request.getJSON(href);
    if (swagger && swagger.paths && swagger.definitions) {
      const data = ctx.model.userConfig.swagger.add({ name, href });
      return ctx.returnSuccess(data);
    }
    return ctx.returnError({ msg: 'swagger api的链接应包含 paths 等字段' });
  } catch (e) {
    return ctx.returnError({ msg: '请输入正确的swagger链接', data: e });
  }
};

const SwaggerRemove = (ctx: Context) => {
  const { id } = ctx.request.body;
  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const data = ctx.model.userConfig.swagger.remove(id);

  return ctx.returnSuccess(data);
};

const getConfigSwagger = (ctx: Context) => {
  const data = ctx.model.userConfig.swagger.get();
  return ctx.returnSuccess(data);
};

const SavePrivateConfig = (ctx: Context) => {
  const data = ctx.request.body;
  const res = ctx.model.userConfig.private.set(data);
  return ctx.returnSuccess(res);
};

export default {
  'POST /api/config/get': getUserConfig,
  'POST /api/config/swagger/get': getConfigSwagger,
  'POST /api/config/swagger/add': SwaggerAdd,
  'POST /api/config/swagger/remove': SwaggerRemove,

  'POST /api/config/savePrivateConfig': SavePrivateConfig
};
