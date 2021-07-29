'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.downloadFromGit = exports.downloadGitFolder = void 0;
/* eslint-disable no-bitwise */
const path_1 = require('path');
const fs_1 = require('fs');
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
const git_1 = require('./git');
const git_url_parse_1 = __importDefault(require('git-url-parse'));
const core_1 = require('@octokit/core');
const spawnSync = cli_shared_utils_1.spawn.sync;
const { log } = console;
const octokit = new core_1.Octokit({});
function downloadFile(owner, repo, ref, repoPath, destPath, onComplete, onError, retryCount = 0) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${repoPath}`;
  cli_shared_utils_1.request
    .get(encodeURI(url))
    .then((res) => {
      const dest = fs_1.createWriteStream(destPath);
      res.body.pipe(dest);
      onComplete(retryCount);
    })
    .catch((err) => {
      if (retryCount <= 2) {
        return downloadFile(owner, repo, ref, repoPath, destPath, onComplete, onError, retryCount + 1);
      }
      return onError();
    });
}
async function downloadFileFormOC(url, destPath, onComplete, onError) {
  if (!url) throw new Error('url 无效');
  try {
    const { data } = await octokit.request(`GET ${url}`);
    const content = cli_shared_utils_1.base64.decode(data.content);
    onComplete();
    cli_shared_utils_1.writeFile(destPath, content);
  } catch (e) {
    const {
      response: { data }
    } = e;
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
async function downloadGitFolder(url, outputPath, options) {
  const { filepath, source, owner, resource, name: repo, ref = 'master' } = git_url_parse_1.default(url);
  const { downloadSource } = options || {};
  if (fs_1.existsSync(outputPath)) {
    throw new Error(`${outputPath} 必须是一个目录`);
  }
  // 不是github的
  if (resource !== 'github.com') {
    return null;
  }
  cli_shared_utils_1.spinner.start(`🗃️ start download File: ${url}`);
  const tree = await git_1.getBlockListFromGit(url, options);
  if (tree.length === 0) {
    cli_shared_utils_1.spinner.fail('length === 0');
    return null;
  }
  let tasks = 0;
  let count = 0;
  tree.forEach((item) => {
    const destPath = path_1.join(outputPath, item.path);
    // 只下载其中一个目录
    if (filepath && !item.path.startsWith(filepath)) return;
    if (item.type === 'tree') {
      cli_shared_utils_1.ensureDirSync(destPath);
    }
    if (item.type === 'blob') {
      tasks++;
      const onComplete = (retryCount) => {
        count++;
        cli_shared_utils_1.spinner.succeed(item.path);
        cli_shared_utils_1.spinner.start(retryCount > 0 ? ` retryCount ${retryCount}` : ` downloading...`);
        if (tasks === count) {
          cli_shared_utils_1.spinner.stop();
          log(cli_shared_utils_1.chalk.green('\n  Download complete.\n'));
        }
      };
      const onError = (reason) => {
        cli_shared_utils_1.spinner.fail(reason || item.path);
      };
      if (downloadSource === 'api') {
        downloadFileFormOC(item.url, destPath, onComplete, onError);
      } else {
        downloadFile(owner, repo, ref, item.path, destPath, onComplete, onError);
      }
    }
  });
  return null;
}
exports.downloadGitFolder = downloadGitFolder;
/**
 * 从 url git 中下载到本地临时目录
 * @param url
 * @param id
 * @param branch
 * @param log
 * @param args
 */
function downloadFromGit(url, id, branch = 'master', args) {
  const { dryRun } = args || {};
  const blocksTempPath = './';
  const templateTmpDirPath = path_1.join(blocksTempPath, id);
  cli_shared_utils_1.spinner.start(`👇 ${url} start pull from git to update...`);
  if (fs_1.existsSync(templateTmpDirPath)) {
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
  cli_shared_utils_1.spinner.stop();
  return templateTmpDirPath;
}
exports.downloadFromGit = downloadFromGit;
