import { getBlockListFromGit, downloadFromGit, downloadFileToLocal } from '../src';
import { writeJSON, got } from '@oumi/cli-shared-utils';
import GitUrlParse from 'git-url-parse';

// download
(async () => {
  const url = 'https://github.com/ant-design/pro-blocks/tree/master/AccountCenter';

  downloadFileToLocal(url, './GIT', { recursive: true, downloadSource: 'api' });
})();
