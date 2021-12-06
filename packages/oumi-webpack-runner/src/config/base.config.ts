import * as path from 'path';
import Chain from 'webpack-chain';

import { getRootPath } from '../utils';

export default (appPath: string, config: Partial<any>) => {
  const chain = new Chain();

  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      symlinks: true,
      modules: [path.join(appPath, 'node_modules'), 'node_modules'],
      alias: null
    },
    resolveLoader: {
      modules: [path.join(getRootPath(), 'node_modules'), 'node_modules']
    }
  });

  return chain;
};
