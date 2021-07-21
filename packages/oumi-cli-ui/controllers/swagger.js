const Swagger = require('@oumi/swagger-api').default;
const fetch = require('../utils/fetch');

const getSwaggerInfo = async (ctx) => {
  const { id } = ctx.request.body;

  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const data = await ctx.model.userConfig.swagger.findById(id);

  if (!data || !data.href) {
    return ctx.returnError(`错误的swagger配置`);
  }

  try {
    const swagger = await fetch(data.href);
    return ctx.returnSuccess(swagger);
  } catch (e) {
    return ctx.returnError(e);
  }
};

const SearchSwaggerData = async (ctx, next) => {
  const { configId, searchTag, searchPath } = ctx.request.body;

  if (!configId || typeof configId !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  if (!searchTag && !searchPath) {
    return ctx.returnError(`搜索不能为空`);
  }

  const data = await ctx.model.userConfig.swagger.findById(configId);

  try {
    const swaggerData = await fetch(data.href);

    const swagger = new Swagger(swaggerData);
    const query = searchTag ? { tag: searchTag } : { path: searchPath };

    swagger.query(query, (res) => {
      ctx.returnSuccess(res);
    });
  } catch (e) {
    console.error(e);
    ctx.returnError(e);
  }

  return next();
};

module.exports = {
  'POST /api/swagger/info': getSwaggerInfo,
  'POST /api/swagger/search': SearchSwaggerData
};
