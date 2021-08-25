'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const folders_1 = require('../connectors/folders');
const task_1 = require('../connectors/task');
const getTasksByProject = async (ctx) => {
  const data = await ctx.model.projectList.findCurrent();
  if (!data) {
    return ctx.returnError(`项目数据异常`);
  }
  const currentPath = data.path;
  const pkg = folders_1.readPackage(currentPath);
  if (!pkg) {
    return ctx.returnError('package.json 不存在');
  }
  if (pkg && pkg.scripts) {
    const findList = await task_1.list({ file: currentPath });
    return ctx.returnSuccess(findList.filter((item) => item.path === currentPath));
  }
  return ctx.returnError('pkg error');
};
exports.default = {
  'POST /api/getTasks': getTasksByProject
};
