export type IServicePathKeys = 'cwd' | 'absNodeModulesPath' | 'absOutputPath' | 'absSrcPath' | 'absPagesPath' | 'absTmpPath';

export type IServicePaths = {
  [key in IServicePathKeys]: string;
};

export type NodeEnv = 'development' | 'production' | 'test';

export type IDep = Record<string, string>;

export type Func = (...args: any[]) => any;

export interface IPackage {
  name?: string;
  dependencies?: IDep;
  devDependencies?: IDep;
  [key: string]: any;
}

export type IPresetItem = string;

export interface IHook {
  name: string;
  key?: string;
  fn: Func;
  pluginId?: string;
  before?: string;
  stage?: number;
  plugin?: string;
}

export interface ICommand extends IHook {
  alias?: string;
  optionsMap?: Record<string, string>;
  synopsisList?: string[];
}

export interface IPlugin {
  id: string;
  path: string;
  opts: any;
  type: PluginType;
  apply: Func;
}

export enum PluginType {
  Preset = 'Preset',
  Plugin = 'Plugin'
}

export interface IApiPaths {
  appPath: string;
  absNodeModulesPath: string;
  absOutputPath: string;
  absSrcPath: string;
  absPagesPath: string;
  absTmpPath: string;
}

export interface IApi {
  id: string;
  path: string;

  appPath: string;
  config: any; // 用户配置文件
  paths: IApiPaths;

  commands: Map<string, ICommand | string>;
  plugins: Map<string, IPlugin>;
  pluginMethods: Map<string, void>;
  methods: Map<string, ((...args: any[]) => void)[]>;
  hooks: Map<string, IHook[]>;

  register: (hook: IHook) => void;

  registerCommand: (command: IHook) => void;

  registerMethod: ({ name: fn }: { name: string; fn?: void }) => void;

  applyPlugins: (args: string | { name: string; initialVal?: any; opts?: any }) => Promise<unknown>;
}
