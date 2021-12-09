import { basename, extname, join } from 'path';
import WebpackDevServer from 'webpack-dev-server';
import Webpack from 'webpack';
import getConfig from './config/getConfig';
import devServerOptions from './config/devServer.config';
import getFile from './utils/getFile';
import type { BaseIConfig } from './typings';

interface MainProps {
  port?: number;
  userConfig?: BaseIConfig;
  args?: any;
}
export const getWebpackConfig = async (appPath: string, config?: MainProps) => {
  return await getConfig({
    appPath,
    env: 'production',
    entry: config?.userConfig?.entry || {}
  });
};

const runDev = (config: Webpack.Configuration, devOptions?: WebpackDevServer.Configuration) => {
  const compiler = Webpack(config);
  const server = new WebpackDevServer({ ...devServerOptions, ...devOptions }, compiler as any);

  const runServer = async () => {
    console.log('Starting server...');
    await server.start();
  };

  runServer();
};

const runBuild = (config: Webpack.Configuration) => {
  const compiler = Webpack(config);
};

export default async (appPath: string, config: MainProps) => {
  const { args = {}, port } = config || {};
  const isDev = process.env.NODE_ENV === 'development';

  let entry: string = args?.entry;

  // 指定入口文件
  if (entry) {
    entry = join(appPath, entry);
  } else {
    const files = [
      getFile({
        base: appPath,
        fileNameWithoutExt: 'src/index',
        type: 'javascript'
      }),
      getFile({
        base: appPath,
        fileNameWithoutExt: 'index',
        type: 'javascript'
      })
    ].filter(Boolean);

    if (files.length === 0) {
      throw new Error("Can't find the default entry.");
    }

    entry = files[0].path!;
  }

  const webpackConfig = await getConfig({
    appPath,
    entry: {
      [basename(entry, extname(entry))]: entry
    },
    env: process.env.NODE_ENV as any
  });

  if (isDev) {
    try {
      await runDev(webpackConfig, { port });
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      await runBuild(webpackConfig);
    } catch (e) {
      console.error(e);
    }
  }
};
