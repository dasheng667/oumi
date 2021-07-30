/* eslint-disable no-bitwise */
import { join } from 'path';
import { existsSync, createWriteStream } from 'fs';
import { spawn, chalk, spinner, ensureDirSync, writeFile, request, base64 } from '@oumi/cli-shared-utils';
import type { DownloadOptions } from './git';
import { getBlockListFromGit } from './git';
import GitUrlParse from 'git-url-parse';
import { Octokit } from '@octokit/core';

const spawnSync = spawn.sync;
const { log } = console;
const octokit = new Octokit({});

function downloadFile({ owner, repo, ref, repoPath, destPath, onComplete, onError, retryCount = 0 }) {
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
        return downloadFile({
          owner,
          repo,
          ref,
          repoPath,
          destPath,
          onComplete,
          onError,
          retryCount: retryCount + 1
        });
      }
      return onError();
    });
}

async function downloadFileFormOC({
  url,
  destPath,
  onComplete,
  onError,
  token
}: {
  url: string;
  destPath: string;
  onComplete;
  onError;
  token;
}) {
  if (!url) throw new Error('url 无效');
  try {
    const access_token = token ? `access_token=${token}` : '';
    const { data } = await octokit.request(`GET ${url}?${access_token}`);
    const content = base64.decode(data.content);
    onComplete();
    writeFile(destPath, content);
  } catch (e) {
    const { response } = e;
    const { data } = response || {};
    if (data && data.message) {
      onError(data.message);
    } else {
      onError();
    }
  }
}

/**
 * 下载git项目中的其中一个目录
 */
export async function downloadFileToLocal(url: string, outputPath: string, options?: DownloadOptions) {
  const { filepath, source, owner, resource, name: repo, ref = 'master' } = GitUrlParse(url);
  const { downloadSource, token } = options || {};

  if (!existsSync(outputPath)) {
    throw new Error(`${outputPath} 必须是一个目录`);
  }

  // 不是github的
  if (resource !== 'github.com') {
    return null;
  }

  spinner.start(`🗃️ start download File: ${url}`);
  const tree = await getBlockListFromGit(url, options);

  if (tree.length === 0) {
    spinner.fail('length === 0');
    return null;
  }

  return new Promise((resolve, reject) => {
    let tasks = 0;
    let count = 0;

    tree.forEach((item) => {
      const destPath = join(outputPath, item.path);

      // 只下载其中一个目录
      if (filepath && !item.path.startsWith(filepath)) return;

      if (item.type === 'tree') {
        ensureDirSync(destPath);
      }

      if (item.type === 'blob') {
        tasks++;

        const onComplete = (retryCount) => {
          count++;
          spinner.succeed(item.path);
          spinner.start(retryCount > 0 ? ` retryCount ${retryCount}` : ` downloading...`);

          if (tasks === count) {
            spinner.stop();
            log(chalk.green('\n  Download complete.\n'));
            resolve(true);
          }
        };

        const onError = (reason) => {
          count++;
          spinner.fail(reason || item.path);

          if (tasks === count) {
            reject(reason || item.path);
            spinner.stop();
          }
        };

        if (downloadSource === 'api') {
          downloadFileFormOC({
            url: item.url,
            destPath,
            token,
            onComplete,
            onError
          });
        } else {
          downloadFile({
            owner,
            repo,
            ref,
            repoPath: item.path,
            destPath,
            onComplete,
            onError
          });
        }
      }
    });
  });
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

  spinner.start(`👇 ${url} start pull from git to update...`);

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
  spinner.stop();
  return templateTmpDirPath;
}
