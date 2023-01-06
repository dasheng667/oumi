import path from 'path';
import fs from 'fs';
import Swagger from '@oumi/swagger-api';
import { request } from '@oumi/cli-shared-utils';
// import { writeJSON } from '@oumi/swagger-api/lib/utils/fs';
import type { Context, Next } from '../typings';

const getSwaggerInfo = async (ctx: Context) => {
  const { id, searchKeyword } = ctx.request.body;

  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  const data = await ctx.model.userConfig.swagger.findById(id);

  if (!data || !data.href) {
    return ctx.returnError(`错误的swagger配置`);
  }

  try {
    const swaggerData: any = await request.getJSON(data.href);
    if (searchKeyword) {
      const swagger = new Swagger(swaggerData);
      const result = swagger.filterPaths(searchKeyword);
      return ctx.returnSuccess(result);
    }
    return ctx.returnSuccess(swaggerData);
  } catch (e) {
    return ctx.returnError(e);
  }
};

const SearchSwaggerData = async (ctx: Context, next: Next) => {
  const { configId, searchTag, searchPath } = ctx.request.body;

  if (!configId || typeof configId !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  if (!searchTag && !searchPath) {
    return ctx.returnError(`搜索不能为空`);
  }

  const data = await ctx.model.userConfig.swagger.findById(configId);

  try {
    const swaggerData: any = await request.getJSON(data.href);

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
const getProjectDirs = async (ctx: Context) => {
  const { currentPath } = ctx.request.body;

  let searchDirPath = currentPath;

  if (!currentPath) {
    const current = ctx.model.projectList.findCurrent() || {};
    searchDirPath = current.path;
  }

  if (!searchDirPath) {
    return ctx.returnError('错误的路径');
  }

  const components: any[] = [];
  const files = fs.readdirSync(searchDirPath);
  const filter = ['node_modules', '__tests__'];

  files.forEach((file, index) => {
    const filePath = path.join(searchDirPath, file);
    const stat = fs.statSync(filePath);
    const extname = path.extname(file);
    const isDir = stat.isDirectory();

    if (filter.includes(file) || file.substr(0, 1) === '.') return;

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

/**
 * 生成swagger文件到本地
 */
// eslint-disable-next-line consistent-return
const BuildSwaggerFileToLocal = async (ctx: Context) => {
  const { configId, outputPath, searchContent } = ctx.request.body;

  if (!configId || typeof configId !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  if (!outputPath) {
    return ctx.returnError('输出路径不能为空');
  }

  if (!Array.isArray(searchContent)) {
    return ctx.returnError('搜索内容不能为空');
  }

  const stat = fs.statSync(outputPath);
  const isDir = stat.isDirectory();

  if (!isDir) {
    return ctx.returnError('路径必须是一个目录');
  }

  const data = await ctx.model.userConfig.swagger.findById(configId);
  const config = await ctx.model.userConfig.swaggerConfig.get();

  try {
    const swaggerData: any = await request.getJSON(data.href);
    const swagger = new Swagger(swaggerData);
    const { requestLibPath, api_fileType = 'ts', mock_fileType = 'js', filterPathPrefix = '', outputFileType, outputFileName } = config;

    swagger.query({ path: searchContent }).toTypeScript();

    // json 模拟数据
    if (config.json_checked) {
      swagger.buildMockJSON({
        outputPath,
        fileType: 'hump',
        filterPathPrefix
      });
    }

    // mockjs模拟数据
    if (config.mock_checked) {
      swagger.buildMockJS({
        outputPath,
        fileType: mock_fileType
      });
    }

    // 输出api文件
    if (config.requestLibPath) {
      swagger.buildApi({
        outputPath,
        fileType: api_fileType,
        requestLibPath,
        filterPathPrefix,
        outputFileType,
        outputFileName,
        requestParams: data.requestParams
      });
    }

    ctx.returnSuccess('success');
  } catch (e) {
    console.error(e);
    ctx.returnError(e);
  }
};

/**
 * 保存配置
 */
const SaveSwaggerConfig = async (ctx: Context) => {
  const { requestLibPath, api_fileType, outputFileType } = ctx.request.body;
  if (!requestLibPath || !api_fileType || !outputFileType) {
    return ctx.returnError('参数异常');
  }

  const data = await ctx.model.userConfig.swaggerConfig.set(ctx.request.body);

  return ctx.returnSuccess(data);
};

export default {
  'POST /api/swagger/info': getSwaggerInfo,
  'POST /api/swagger/search': SearchSwaggerData,
  'POST /api/project/dirs': getProjectDirs,
  'POST /api/swagger/build': BuildSwaggerFileToLocal,
  'POST /api/swagger/saveConfig': SaveSwaggerConfig
};
