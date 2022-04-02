import GitUrlParse from 'git-url-parse';
import { request } from '@oumi/cli-shared-utils';

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
