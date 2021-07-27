const path = require('path');
const fs = require('fs');

const resolve = (dir) => {
  return path.resolve(__dirname, '../', dir);
};

const fn_hello = async (ctx, next) => {
  const { name } = ctx.params;
  ctx.returnSuccess({ a: 'a' });
};

/**
 * 查找用户目录
 * @param {*} ctx
 * @param {*} next
 */
const getUserFolder = async (ctx, next) => {
  const postData = ctx.request.body;
  const lastImportPath = ctx.model.lastImportPath.get();

  function getFolder(paramsPath) {
    let folder = '';
    if (Array.isArray(paramsPath)) {
      const dir = paramsPath.join(path.sep);
      if (paramsPath.length === 1) {
        return `${paramsPath}${path.sep}`;
      }
      folder = path.join(dir);
      if (fs.existsSync(folder)) {
        return folder;
      }
      return resolve('../');
    }
    if (paramsPath) {
      if (fs.existsSync(paramsPath)) {
        return paramsPath;
      }
    }
    return resolve('../');
  }

  const currentPath = getFolder(postData.rootPathArr || lastImportPath);
  const files = fs.readdirSync(currentPath);
  const isPackage = files.includes('package.json');
  const dir_files = files.filter((f) => {
    if (f === 'package.json') return true;
    if (f === 'LICENSE') return false;
    return f.indexOf('.') === -1 && f !== 'node_modules';
  });

  // 路径转数组存本地
  const currentPathArr = currentPath.split(path.sep);

  // 记录最后一次路径
  ctx.model.lastImportPath.set(currentPathArr);

  ctx.returnSuccess({
    currentPath: currentPathArr,
    files: dir_files,
    isPackage
  });
};

/**
 * 项目列表
 */
const getProjectList = async (ctx, next) => {
  const list = ctx.model.projectList.get();
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.path) {
        // 删除错误的目录结构
        if (!fs.existsSync(item.path)) {
          ctx.model.projectList.remove({ id: item.id });
          ctx.model.dashboard.set('');
        }
      }
    }
  }
  ctx.returnSuccess(list || []);
};
/**
 * 移除某个项目
 */
const removeProject = async (ctx, next) => {
  const { id, name } = ctx.request.body;
  if (!id && !name) {
    return ctx.returnError(`参数异常`);
  }
  const remove = ctx.model.projectList.remove({ id, name });
  return ctx.returnSuccess(remove);
};

/**
 * 导入目录到项目
 */
const importToProject = async (ctx, next) => {
  const { importPath } = ctx.request.body;
  if (!importPath) {
    return ctx.returnError(`导入目录不能为空`);
  }
  const projectPath = importPath.join(path.sep);

  try {
    const pkg = require(path.join(projectPath, './package.json'));
    const name = pkg.name || importPath[importPath.length - 1];

    ctx.model.projectList.push({
      name,
      path: projectPath
    });

    return ctx.returnSuccess(pkg);
  } catch (e) {
    return ctx.returnError(e);
  }
};

/**
 * 选中一个项目做默认看板
 */
const setProjectDashboard = async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id || typeof id !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  ctx.model.dashboard.set(id);
  return ctx.returnSuccess(id);
};

/**
 * 找默认项目看板
 * @param {*} ctx
 * @returns
 */
const getDashboardByProject = async (ctx) => {
  try {
    const id = ctx.model.dashboard.get();
    if (!id) {
      return ctx.returnError('没有这个项目');
    }
    const project = ctx.model.projectList.find({ id });
    if (project) {
      if (fs.existsSync(project.path)) {
        return ctx.returnSuccess(project);
      }
      ctx.model.projectList.remove({ id: project.id });
      return ctx.returnError('目录错误');
    }
    return ctx.returnError('没有这个项目');
  } catch (e) {
    return ctx.returnError(e);
  }
};

/**
 * 创建项目文件夹
 * @param {*} ctx
 */
const createProjectDir = async (ctx) => {
  const { currentPath, dirName } = ctx.request.body;

  if (!dirName || typeof dirName !== 'string') {
    return ctx.returnError(`参数异常`);
  }

  let createPath = currentPath;

  if (!createPath) {
    const data = await ctx.model.projectList.findCurrent();
    if (!data) {
      return ctx.returnError(`项目数据异常`);
    }
    createPath = data.path;
  }

  const isDir = fs.statSync(createPath).isDirectory();

  if (!isDir) {
    return ctx.returnError('必须是文件目录');
  }

  const dir = path.join(createPath, dirName);

  if (fs.existsSync(dir)) {
    return ctx.returnError('目录已存在');
  }

  fs.mkdirSync(dir);
  return ctx.returnSuccess('success');
};

module.exports = {
  'GET /api/hello/:name': fn_hello,
  'POST /api/user/folder': getUserFolder,
  'POST /api/project/list': getProjectList,
  'POST /api/project/remove': removeProject,
  'POST /api/project/dashboard': setProjectDashboard,
  'POST /api/project/import': importToProject,

  'POST /api/project/createDir': createProjectDir,

  'POST /api/dashboard/get': getDashboardByProject
};
