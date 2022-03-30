import { join } from 'path';
import Chain from 'webpack-chain';
// import { logInspect } from '@oumi/cli-shared-utils';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getBabelOpts } from '@oumi/babel-preset';
import plugins from './plugins';
import type { IWebpackEntryOpts } from '../typings';

const babelImportPlugins = [
  {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  },
  {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es',
    style: true
  }
];

export default async function getConfig(opts: IWebpackEntryOpts): Promise<Chain> {
  const { appPath, entry, config = {}, env, staticDir = 'static', inlineLimit = 2048 } = opts;

  const isDev = env === 'development';

  const webpackChain = new Chain();

  webpackChain.mode(env);

  const babelOpts: any = getBabelOpts({
    import: babelImportPlugins
  });

  // entry
  if (entry) {
    // 手动传入
    Object.keys(entry).forEach((key) => {
      const e = webpackChain.entry(key);
      e.add(entry[key]);
    });
  }
  if (config.entry && typeof config.entry === 'object') {
    // 用户的配置文件
    Object.keys(config.entry).forEach((key) => {
      const e = webpackChain.entry(key);
      e.add(config.entry[key]);
    });
  }

  const absOutputPath = join(appPath, config.outputPath || 'dist');

  webpackChain.output
    .path(absOutputPath)
    .filename(`[name].[contenthash:8].js`)
    .chunkFilename(`[name].[contenthash:8].async.js`)
    .publicPath(config.publicPath || '');

  // resolve
  webpackChain.resolve
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    .end()
    .extensions.merge(['.web.js', '.wasm', '.mjs', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']);

  // resolve.alias
  if (config.alias) {
    Object.keys(config.alias).forEach((key) => {
      webpackChain.resolve.alias.set(key, config.alias![key]);
    });
  }

  webpackChain.module
    .rule('less')
    .test(/\.less/)
    .when(
      isDev,
      (c) => c.rule('less').use('style-loader').loader('style-loader'),
      (c) => c.rule('less').use('css-extract').loader(MiniCssExtractPlugin.loader)
    )
    .use('css-loader')
    .loader('css-loader')
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .end()
    .use('less-loader')
    .loader('less-loader')
    .options({
      lessOptions: {
        // modifyVars: require('../theme'),
        javascriptEnabled: true
      },
      sourceMap: true
    });

  webpackChain.module
    .rule('scss')
    .test(/\.(sa|sc|c)ss$/)
    .when(
      isDev,
      (c) => c.rule('sass').use('style-loader').loader('style-loader'),
      (c) => c.rule('sass').use('css-extract').loader(MiniCssExtractPlugin.loader)
    )
    .use('css-loader')
    .loader('css-loader')
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .end()
    .use('sass-loader')
    .loader('sass-loader')
    .options({
      implementation: require('sass'),
      sassOptions: {
        fiber: require('fibers')
      }
    });

  webpackChain.module
    .rule('js')
    .test(/\.(js|jsx|ts|tsx)$/)
    .use('babel-loader')
    .loader('babel-loader')
    .options({
      ...babelOpts
      // TODO，plugins注意会覆盖，后续完善
      // plugins: [...babelImportPlugins, isDev && require('react-refresh/babel')].filter(Boolean),
    })
    .end();

  webpackChain.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
    .use('url-loader')
    .options({
      limit: inlineLimit,
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    });

  webpackChain.module
    .rule('fonts')
    .test(/\.(woff|eot|ttf|mp3|otf)$/)
    .use('file-loader')
    .options({
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    })
    .end();

  webpackChain.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .options({
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    })
    .end();

  plugins(webpackChain, opts);

  return webpackChain;
}
