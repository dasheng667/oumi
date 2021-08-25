import { readPackage } from '../connectors/folders';
import { list } from '../connectors/task';
import type { Context } from '../../typings';

const getTasksByProject = async (ctx: Context) => {
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
    const findList: any[] = await list({ file: currentPath });
    return ctx.returnSuccess(findList.filter((item) => item.path === currentPath));
  }
  return ctx.returnError('pkg error');
};

export default {
  'POST /api/getTasks': getTasksByProject
};
