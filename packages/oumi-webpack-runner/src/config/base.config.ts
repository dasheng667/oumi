import * as path from 'path';
import Chain from 'webpack-chain';
import type { IConfig } from '../typings';

// import { getRootPath } from '../utils';

export default (appPath: string, config: IConfig) => {
  const chain = new Chain();
  const { paths } = config;

  chain.resolve.modules
    .add(path.join(appPath, 'node_modules'))
    .add('node_modules')
    .end()
    .mainFields.clear()
    .add('browser')
    .add('main')
    .end()
    .extensions.add('.ts')
    .add('.tsx')
    .add('.js')
    .add('.jsx')
    .add('.vue')
    .end()
    .alias.set('@/*', paths.absSrcPath)
    .end();

  return chain;
};
