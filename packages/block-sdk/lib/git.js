'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getBlockListFromGit = exports.genBlockName = void 0;
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
const git_url_parse_1 = __importDefault(require('git-url-parse'));
/**
 * * 预览专用 *
 * 从文件数组映射为 pro 的路由
 * @param {*} name
 */
exports.genBlockName = (name) =>
  name
    .match(/[A-Z]?[a-z]+|[0-9]+/g)
    .map((p) => p.toLowerCase())
    .join('/');
exports.getBlockListFromGit = async (gitUrl, options) => {
  const ignoreFile = ['_scripts', 'tests'];
  const {
    useBuiltJSON = false, // 使用内置的json配置
    recursive = false, // git递归
    token = ''
  } = options || {};
  const { name, owner, resource, ref = 'master' } = git_url_parse_1.default(gitUrl);
  if (useBuiltJSON) {
    const url = `https://raw.githubusercontent.com/${owner}/${name}/${ref}/umi-block.json`;
    cli_shared_utils_1.startSpinner('🔍', `find block list form ${cli_shared_utils_1.chalk.yellow(url)}`);
    try {
      const { body } = await cli_shared_utils_1.got(url);
      cli_shared_utils_1.stopSpinner();
      return JSON.parse(body);
    } catch (error) {
      console.error(error.body);
      cli_shared_utils_1.failSpinner('404');
    }
    return [];
  }
  if (resource !== 'github.com') {
    return [];
  }
  // 一个 github 的 api,可以获得文件树
  const recursiveParams = recursive ? 'recursive=1' : '';
  const url = `https://api.github.com/repos/${owner}/${name}/git/trees/${ref}?${recursiveParams}`;
  cli_shared_utils_1.startSpinner('🔍', `find block list form ${cli_shared_utils_1.chalk.yellow(url)}`);
  try {
    const access_token = token ? `access_token=${token}` : '';
    const { body } = await cli_shared_utils_1.got(`${url}?${access_token}`);
    const filesTree = JSON.parse(body);
    if (recursive) {
      return filesTree.tree.map((item) => ({
        ...item,
        img: `https://github.com/${owner}/${name}/raw/${ref}/${item.path}/snapshot.png`
      }));
    }
    const filterTree = filesTree.tree
      .filter((file) => file.type === 'tree' && !ignoreFile.includes(file.path) && file.path.indexOf('.') !== 0)
      .map(({ path, type, url: shaUrl }) => ({
        url: `${gitUrl}/tree/${ref}/${path}`,
        type,
        path,
        isPage: true,
        defaultPath: `/${path}`,
        img: `https://github.com/${owner}/${name}/raw/${ref}/${path}/snapshot.png`,
        // tags: [''],
        name: path,
        shaUrl
        // previewUrl: `https://preview.pro.ant.design/${genBlockName(path)}`,
      }));
    cli_shared_utils_1.stopSpinner();
    return filterTree;
  } catch (error) {
    console.error(error.body);
    cli_shared_utils_1.failSpinner('404');
    return [];
  }
};
