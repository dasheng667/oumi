import { getBlockListFromGit, downloadFromGit, downloadGitFolder } from '../src';
import { writeJSON } from '@oumi/cli-shared-utils';
import GitUrlParse from 'git-url-parse';

(async () => {
  // const json = await getBlockListFromGit('https://github.com/ant-design/pro-blocks', true);
  // writeJSON('test2.json', json)
  // const down = downloadFromGit('https://github.com/ant-design/pro-blocks/tree/master/AccountCenter', 'ID1')
  // console.log('2:', await getBlockListFromGit('https://github.com/umijs/umi'))
})();

// (async ()=>{

//   const url = 'https://github.com/ant-design/pro-blocks/tree/master/AccountCenter';

//   const { filepath, source, owner, resource, name }  = GitUrlParse(url);

//   const tree = await getBlockListFromGit(url);

//   console.log('component', tree.find((item: any) => item.path === filepath))

// })();

// download
(async () => {
  const url = 'https://github.com/ant-design/pro-blocks/tree/master/AccountCenter';

  const tree = downloadGitFolder(url);
})();
