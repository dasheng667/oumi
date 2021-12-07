import webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import baseConfig from './config/base.config';
import devConfig from './config/dev.config';
import type { IConfig } from './typings';

async function runDev(appPath: string, config: IConfig) {
  const chain = devConfig(appPath, config);
  console.log('config = ', chain.toConfig());
}

export default (appPath: string, config: IConfig) => {
  const { watch } = config || {};
  if (watch) {
    try {
      runDev(appPath, config);
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      runDev(appPath, config);
    } catch (e) {
      console.error(e);
    }
  }
};
