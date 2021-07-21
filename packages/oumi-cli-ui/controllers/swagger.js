const path = require('path');
const fs = require('fs');
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

// 活动当前项目下的文件
const getProjectDirs = async (ctx) => {
  const { currentPath } = ctx.request.body;

  let searchDirPath = currentPath;

  if (!currentPath) {
    const current = ctx.model.projectList.findCurrent() || {};
    searchDirPath = current.path;
  }

  if (!searchDirPath) {
    return ctx.returnError('错误的路径');
  }

  const components = [];
  const files = fs.readdirSync(searchDirPath);
  const filter = ['node_modules', '__tests__'];

  files.forEach((file, index) => {
    const filePath = path.join(searchDirPath, file);
    const stat = fs.statSync(filePath);
    const extname = path.extname(file);
    const isDir = stat.isDirectory();

    if (filter.includes(file)) return;

    components.push({
      title: file,
      key: filePath,
      isLeaf: !isDir,
      // children: isDir ? [] : null,
      dirPath: isDir ? filePath : null
      // isDir,
      // extname
    });
  });

  components.sort((a, b) => a.isLeaf - b.isLeaf);

  return ctx.returnSuccess(components);
};

module.exports = {
  'POST /api/swagger/info': getSwaggerInfo,
  'POST /api/swagger/search': SearchSwaggerData,
  'POST /api/project/dirs': getProjectDirs
};
