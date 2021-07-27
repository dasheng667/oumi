import { join, extname, sep } from 'path';
import { existsSync } from 'fs';
import { spawn, chalk, startSpinner, stopSpinner, base64, writeFile } from '@oumi/cli-shared-utils';
import { getBlockListFromGit } from './git';
import GitUrlParse from 'git-url-parse';
import { Octokit } from '@octokit/core';
import token from './token';

const spawnSync = spawn.sync;
const octokit = new Octokit({});

/**
 * 从 url git 中下载到本地临时目录
 * @param url
 * @param id
 * @param branch
 * @param log
 * @param args
 */
export function downloadFromGit(url, id, branch = 'master', args?) {
  const { dryRun } = args || {};
  const blocksTempPath = './';
  const templateTmpDirPath = join(blocksTempPath, id);
  const log = chalk.yellow;

  startSpinner('👇', `${url} start pull from git to update...`);

  if (existsSync(templateTmpDirPath)) {
    // git repo already exist, pull it
    // cd id && git pull
    if (dryRun) {
      log(`dryRun is true, skip git pull`);
    } else {
      spawnSync('git', ['fetch'], {
        cwd: templateTmpDirPath
      });
      spawnSync('git', ['checkout', branch], {
        cwd: templateTmpDirPath
      });
      spawnSync('git', ['pull'], {
        cwd: templateTmpDirPath
      });
    }
  } else {
    spawnSync('git', ['clone', url, id, '--single-branch', '-b', branch], {
      cwd: blocksTempPath
    });
  }
  stopSpinner();
  return templateTmpDirPath;
}

type IOptions = {
  url: string;
  path: string;
};

const filter = ['packages.json'];

const validateFile = (path: string) => {
  const arr = path.split(sep);
  return arr.some((p) => p.startsWith('.') || filter.includes(p));
};

export async function deepFindGitFile(options: IOptions, outputPath: string) {
  const { url, path } = options;
  if (!url) return;
  if (typeof url !== 'string') throw new Error(`${url}: url必须是字符串`);

  if (validateFile(outputPath)) return;

  startSpinner('🗃️', `start download File: ${outputPath}`);

  try {
    const { data } = await octokit.request(`GET ${url}?${token}`);
    if (data && Array.isArray(data.tree)) {
      const pkg = data.tree.some((item) => item.path === 'package.json');
      const src = data.tree.find((item) => item.path === 'src');
      //  是个子项目
      if (pkg && src) {
        deepFindGitFile(src, outputPath);
      } else {
        data.tree.forEach((item) => {
          if (item.path.startsWith('.')) return;
          deepFindGitFile(item, join(outputPath, item.path));
        });
      }
    } else if (data && data.type !== 'tree') {
      const content = base64.decode(data.content);
      writeFile(outputPath, content);
      stopSpinner();
    }
  } catch (e) {
    console.error(e);
    stopSpinner('404');
  }
}

/**
 * 下载git项目中的其中一个目录
 */
export async function downloadGitFolder(url: string) {
  const { filepath, source, owner, resource, name } = GitUrlParse(url);

  // 不是github的
  if (resource !== 'github.com') {
    return null;
  }

  const tree = await getBlockListFromGit(url);

  if (Array.isArray(tree)) {
    const data = tree.find((item: any) => item.path === filepath);

    // 没有找到该目录
    if (!data || !data.shaUrl) {
      return null;
    }

    deepFindGitFile({ url: data.shaUrl, path: data.path }, join('./GIT'));
  }

  return null;
}
