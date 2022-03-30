import type { IApiPaths } from '@oumi/kernel/typings/type';
import type webpack from 'webpack';
import type WebpackChain from 'webpack-chain';
import type { Configuration } from 'webpack';

export type Env = 'development' | 'production';

export interface ICreateCSSRule {
  (opts: { lang: string; test: RegExp; loader?: string; options?: object }): void;
}

export interface ICopy {
  from: string;
  to: string;
}

interface IServerOpts {
  port?: string;
  port?: number;
  proxy?: any;
  https?: IHttps | boolean;
  headers?: Record<string, string>;
}

type IPresetOrPlugin = string | [string, any];

export interface BaseIConfig {
  entry?: Record<string, string>;
  alias?: Record<string, string>;
  analyze?: object;
  autoprefixer?: object;
  base?: string;
  chainWebpack?: {
    (
      memo: WebpackChain,
      args: {
        webpack: typeof webpack;
        env: Env;
        createCSSRule: ICreateCSSRule;
      }
    ): void;
  };
  chunks?: string[];
  cssLoader?: object;
  cssModulesTypescriptLoader?: { mode?: 'verify' | 'emit' };
  cssnano?: object;
  copy?: (string | ICopy)[];
  define?: Record<string, any>;
  devServer?: IServerOpts;
  devtool?: webpack.Options.Devtool;
  dynamicImport?: {
    loading?: string;
  };
  dynamicImportSyntax?: {};
  exportStatic?: {
    htmlSuffix?: boolean;
    dynamicRoot?: boolean;
    extraRoutePaths?: () => Promise<string[]>;
  };

  externals?: any;
  extraBabelIncludes?: string[];
  extraPostCSSPlugins?: any[];
  favicon?: string;
  forkTSChecker?: object;
  fastRefresh?: object;
  hash?: boolean;
  history?: {
    type: 'browser' | 'hash' | 'memory';
    options?: object;
  };

  inlineLimit?: number;
  lessLoader?: object;
  links?: Partial<HTMLLinkElement>[];
  metas?: Partial<HTMLMetaElement>[];
  mock?: { exclude?: string[] };
  nodeModulesTransform?: {
    type: 'all' | 'none';
    exclude?: string[];
  };
  outputPath?: string;
  plugins?: IPresetOrPlugin[];
  polyfill?: { imports: string[] };
  postcssLoader?: object;
  presets?: IPresetOrPlugin[];
  proxy?: any;
  publicPath?: string;
  styleLoader?: object;
  [key: string]: any;
}

export interface IWebpackEntryOpts {
  appPath: string;
  env: Env;
  config?: BaseIConfig;
  entry?: Record<string, string>;
  hot?: boolean;
  port?: number;
  sourceRoot?: string;
  staticDir?: string;
  inlineLimit?: number;
  babelOpts?: object;
  babelOptsForDep?: object;
  targets?: any;
  browserslist?: any;
  modifyBabelOpts?: (opts: object, args?: any) => Promise<any>;
  modifyBabelPresetOpts?: (opts: object, args?: any) => Promise<any>;
  chainWebpack?: (webpackConfig: any, args: any) => Promise<any>;
  miniCSSExtractPluginPath?: string;
  miniCSSExtractPluginLoaderPath?: string;
}
