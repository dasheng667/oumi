import path from 'path';
import type Chain from 'webpack-chain';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { IWebpackEntryOpts } from '../typings';

export default (webpackChain: Chain, opts: IWebpackEntryOpts) => {
  const { appPath, env, sourceRoot = 'src' } = opts;
  const isDev = env === 'development';

  webpackChain.plugin('html').use(HtmlWebpackPlugin, [
    {
      template: path.join(appPath, sourceRoot, 'index.html'),
      filename: 'index.html'
    }
  ]);

  return webpackChain;
};
