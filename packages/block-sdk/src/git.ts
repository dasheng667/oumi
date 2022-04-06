import { got, chalk, startSpinner, stopSpinner, failSpinner, request } from '@oumi/cli-shared-utils';
import GitUrlParse from 'git-url-parse';

export type DownloadOptions = {
  useBuiltJSON?: boolean;
  recursive?: boolean;
  downloadSource?: 'raw' | 'api';
  token?: string;
  path?: string; // 文件路径
  projectId?: number; // gitlab需要projectId
};

export const isGithub = (url: string) => {
  return url.indexOf('github') > -1;
};

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

/**
 * gitlab
 * @param url gitlab url
 * http://www.explame.com/api/v4/projects/001/repository/tree
 */
export const getBlockTreeByGitlab = async (url: string, options?: DownloadOptions) => {
  const { projectId, path } = options;
  if (!projectId) {
    throw new Error('gitlab项目 projectId 不能为空');
  }
  const parse = GitUrlParse(url);
  const { protocol, resource, port } = parse;
  const hrefPort = port && port !== 80 ? `:${port}` : '';
  const urlPath = encodeURIComponent(`${path}/src`); // 默认规则，每个目录src
  const href = `${protocol}://${resource}${hrefPort}/api/v4/projects/${projectId}/repository/tree?path=${urlPath}`;
  startSpinner('🔍', `find gitlab block list form ${chalk.yellow(href)}`);
  try {
    const content = await request.get(href);
    stopSpinner();
    const res = await content.json();
    return res;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getBlockListFromGit = async (gitUrl, options?: DownloadOptions) => {
  const ignoreFile = ['_scripts', 'tests'];
  const {
    useBuiltJSON = false, // 使用内置的json配置
    recursive = false, // git递归
    token = ''
  } = options || {};

  // 非github，默认gitlab。
  if (!isGithub(gitUrl)) {
    return await getBlockTreeByGitlab(gitUrl, options);
  }

  const { name, owner, resource, ref = 'master' } = GitUrlParse(gitUrl);

  if (useBuiltJSON) {
    const url = `https://raw.githubusercontent.com/${owner}/${name}/${ref}/umi-block.json`;

    startSpinner('🔍', `find block list form ${chalk.yellow(url)}`);
    try {
      const { body } = await got(url);
      stopSpinner();
      return JSON.parse(body);
    } catch (error: any) {
      console.error(error.body);
      failSpinner('404');
    }
    return [];
  }

  // 一个 github 的 api,可以获得文件树
  const recursiveParams = recursive ? 'recursive=1' : '';
  const url = `https://api.github.com/repos/${owner}/${name}/git/trees/${ref}?${recursiveParams}`;
  startSpinner('🔍', `find block list form ${chalk.yellow(url)}`);

  try {
    const access_token = token ? `access_token=${token}` : '';
    const { body } = await got(`${url}?${access_token}`);
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

    stopSpinner();
    return filterTree;
  } catch (error: any) {
    console.error(error.body);
    failSpinner('404');
    return [];
  }
};

export const getGitlabRawUrl = (url: string) => {
  const parse = GitUrlParse(url);
  let newUrl = url;

  if (parse.filepathtype === 'blob') {
    newUrl = newUrl.replace('/blob/', '/raw/');
  }

  return newUrl;
};

export const getBlockListFromGitLab = async (url: string) => {
  try {
    const json: any = await request.getJSON(getGitlabRawUrl(url));
    if (!json) {
      throw new Error('空 blocks');
    }
    if (!Array.isArray(json.list)) {
      throw new Error('blocks 缺少根字段list');
    }
    return json.list;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const queryRepositoryFile = async (url: string, { isGitLab }: { isGitLab: boolean }) => {
  try {
    if (isGitLab) {
      const href = `${getGitlabRawUrl(url)}/src/index.tsx`;
      const res: any = await request.get(href);
      const content = await res.text();
      return content;
    }
    const parse = GitUrlParse(url);
    const { owner, name, ref, filepath } = parse;
    const fetchUrl = `https://raw.githubusercontent.com/${owner}/${name}/${ref}/${filepath}/src/index.tsx`;
    const res: any = await request.get(fetchUrl);
    const content = await res.text();
    return content;
  } catch (e: any) {
    throw new Error(e);
  }
};
