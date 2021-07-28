/* eslint-disable no-bitwise */
import { join, extname, sep } from 'path';
import { existsSync, createWriteStream } from 'fs';
import {
  spawn,
  chalk,
  startSpinner,
  stopSpinner,
  spinner,
  writeJSON,
  ensureDirSync,
  writeFile,
  request
} from '@oumi/cli-shared-utils';
import type { DownloadOptions } from './git';
import { getBlockListFromGit } from './git';
import GitUrlParse from 'git-url-parse';

const spawnSync = spawn.sync;
const { log } = console;

function downloadFile(owner, repo, ref, repoPath, destPath, onComplete, onError, retryCount = 0) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${repoPath}`;

  request
    .get(encodeURI(url))
    .then((res) => {
      const dest = createWriteStream(destPath);
      res.body.pipe(dest);
      onComplete(retryCount);
    })
    .catch((err) => {
      if (retryCount <= 2) {
        return downloadFile(owner, repo, ref, repoPath, destPath, onComplete, onError, retryCount + 1);
      }
      return onError(err);
    });
}

/**
 * 下载git项目中的其中一个目录
 */
export async function downloadGitFolder(url: string, options?: DownloadOptions) {
  const { filepath, source, owner, resource, name: repo, ref = 'master' } = GitUrlParse(url);

  // 不是github的
  if (resource !== 'github.com') {
    return null;
  }

  startSpinner('🗃️', `start download File: ${url}`);
  const tree = await getBlockListFromGit(url, options);

  if (tree.length === 0) {
    spinner.fail('length === 0');
    return null;
  }

  tree.forEach((item) => {
    const destPath = `./GIT/${item.path}`;

    // 只下载其中一个目录
    if (filepath && !item.path.startsWith(filepath)) return;

    if (item.type === 'tree') {
      ensureDirSync(destPath);
    }

    if (item.type === 'blob') {
      downloadFile(
        owner,
        repo,
        ref,
        item.path,
        destPath,
        (retryCount = 0) => {
          spinner.succeed(item.path);
          spinner.start(retryCount > 0 ? ` retryCount ${retryCount}` : ` downloading...`);
        },
        () => {
          spinner.fail(item.path);
        }
      );
    }
  });

  return null;
}

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
