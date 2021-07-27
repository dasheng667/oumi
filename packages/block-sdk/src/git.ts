import { got, chalk, startSpinner, stopSpinner, failSpinner } from '@oumi/cli-shared-utils';
import token from './token';
import GitUrlParse from 'git-url-parse';

/**
 * * 预览专用 *
 * 从文件数组映射为 pro 的路由
 * @param {*} name
 */
export const genBlockName = (name) =>
  name
    .match(/[A-Z]?[a-z]+|[0-9]+/g)
    .map((p) => p.toLowerCase())
    .join('/');

export const getBlockListFromGit = async (gitUrl, useBuiltJSON?) => {
  const ignoreFile = ['_scripts', 'tests'];

  const { name, owner, resource } = GitUrlParse(gitUrl);

  // 使用内置的json配置
  if (useBuiltJSON) {
    const url = `https://raw.githubusercontent.com/${owner}/${name}/master/umi-block.json`;

    startSpinner('🔍', `find block list form ${chalk.yellow(url)}`);
    try {
      const { body } = await got(url);
      stopSpinner();
      return JSON.parse(body);
    } catch (error) {
      console.error(error.body);
      failSpinner('404');
    }
    return [];
  }

  if (resource !== 'github.com') {
    return [];
  }

  // 一个 github 的 api,可以获得文件树
  const url = `https://api.github.com/repos/${owner}/${name}/git/trees/master`;
  startSpinner('🔍', `find block list form ${chalk.yellow(url)}`);

  try {
    const { body } = await got(`${url}?${token}`);
    const filesTree = JSON.parse(body)
      .tree.filter((file) => file.type === 'tree' && !ignoreFile.includes(file.path) && file.path.indexOf('.') !== 0)
      .map(({ path, type, url: shaUrl }) => ({
        url: `${gitUrl}/tree/master/${path}`,
        type,
        path,
        isPage: true,
        defaultPath: `/${path}`,
        img: `https://github.com/${owner}/${name}/raw/master/${path}/snapshot.png`,
        // tags: [''],
        name: path,
        shaUrl
        // previewUrl: `https://preview.pro.ant.design/${genBlockName(path)}`,
      }));

    stopSpinner();
    return filesTree;
  } catch (error) {
    console.error(error.body);
    failSpinner('404');
    return [];
  }
};
