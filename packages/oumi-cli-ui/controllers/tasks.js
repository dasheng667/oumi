const { readPackage } = require('../connectors/folders');
const { list } = require('../connectors/task');

const getTasksByProject = async (ctx) => {
  const data = await ctx.model.projectList.findCurrent();
  if (!data) {
    return ctx.returnError(`项目数据异常`);
  }
  const currentPath = data.path;
  const pkg = readPackage(currentPath);

  if (!pkg) {
    return ctx.returnError('package.json 不存在');
  }

  if (pkg && pkg.scripts) {
    const findList = await list({ file: currentPath });
    return ctx.returnSuccess(findList.filter((item) => item.path === currentPath));
  }
  return ctx.returnError('pkg error');
};

module.exports = {
  'POST /api/getTasks': getTasksByProject
};
