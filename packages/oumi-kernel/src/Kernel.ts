/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { AsyncSeriesWaterfallHook } from 'tapable';
import { EventEmitter } from 'events';
import { createDebug } from '@oumi/cli-shared-utils';
import Config from './Config';
import { mergePlugins, resolvePresetsOrPlugins } from './utils';
import getPaths from './utils/getPaths';
import { PluginType, IS_MODIFY_HOOK, IS_ADD_HOOK, IS_EVENT_HOOK } from './utils/constants';
import Plugin from './Plugin';

import type { ICommand, IHook, IPackage, IPresetItem, IPlugin } from '../typings/type';

interface IKernelOptions {
  appPath: string;
  pkg?: object;
  presets?: IPresetItem[];
  plugins?: IPresetItem[];
}

export default class Kernel extends EventEmitter {
  appPath: string;
  pkg: IPackage;

  // 生命周期 、 注册命令
  commands: Map<string, ICommand | string>;

  plugins: Map<string, IPlugin>;

  pluginMethods: Map<string, void>;

  optsPresets: IPresetItem[];
  extraPlugins: IPlugin[];

  optsPlugins: IPresetItem[];

  // 用户的配置
  userConfig: Config;

  hooks: Map<string, IHook[]>;

  methods: Map<string, ((...args: any[]) => void)[]>;

  // paths
  paths: {
    appPath?: string;
    absNodeModulesPath?: string;
    absSrcPath?: string;
    absPagesPath?: string;
    absOutputPath?: string;
    absTmpPath?: string;
  } = {};

  args: any;
  debugger: any;

  config: any;

  constructor(options: IKernelOptions) {
    super();
    this.debugger = createDebug('Oumi:Kernel');
    this.appPath = options.appPath || process.cwd();

    this.optsPresets = options.presets;
    this.optsPlugins = options.plugins;

    this.hooks = new Map();
    this.plugins = new Map();
    this.methods = new Map();
    this.pluginMethods = new Map();
    this.commands = new Map();
  }

  async init() {
    this.initConfig();

    this.paths = getPaths({
      appPath: this.appPath,
      config: this.userConfig!
    });

    this.initPresetsAndPlugins();
    await this.applyPlugins('onReady');
  }

  initConfig() {
    this.userConfig = new Config({
      appPath: this.appPath
    });
    this.config = this.userConfig.initialConfig;

    this.debugger('initConfig', this.config);
  }

  initPresetsAndPlugins() {
    const { config } = this;
    const allConfigPresets = mergePlugins(this.optsPresets || [], config.presets || [])();
    const allConfigPlugins = mergePlugins(this.optsPlugins || [], config.plugins || [])();

    this.plugins = new Map();
    this.extraPlugins = [];
    this.resolvePresets(allConfigPresets);
    this.resolvePlugins(allConfigPlugins);
  }

  resolvePresets(presets) {
    const allPresets = resolvePresetsOrPlugins(this.appPath, presets, PluginType.Preset);
    while (allPresets.length) {
      this.initPreset(allPresets.shift()!);
    }
  }

  resolvePlugins(plugins) {
    const allPlugins = resolvePresetsOrPlugins(this.appPath, plugins, PluginType.Plugin);
    const _plugins = [...allPlugins];
    while (_plugins.length) {
      this.initPlugin(_plugins.shift()!);
    }
    this.extraPlugins = [];
  }

  initPreset(preset: IPlugin) {
    this.debugger('initPreset', preset);
    const { id, path, opts, apply } = preset;
    const pluginCtx = this.initPluginCtx({ id, path, ctx: this });
    const { presets, plugins } = apply()(pluginCtx, opts) || {};
    this.registerPlugin(preset);

    // if (Array.isArray(presets)) {
    //   const _presets = resolvePresetsOrPlugins(this.appPath, convertPluginsToObject(presets)(), PluginType.Preset)
    //   while (_presets.length) {
    //     this.initPreset(_presets.shift()!)
    //   }
    // }
    // if (Array.isArray(plugins)) {
    //   this.extraPlugins.push(...resolvePresetsOrPlugins(this.appPath, convertPluginsToObject(plugins)(), PluginType.Plugin))
    // }
  }

  initPlugin(plugin: IPlugin) {
    const { id, path, opts, apply } = plugin;
    const pluginCtx = this.initPluginCtx({ id, path, ctx: this });
    this.debugger('initPlugin', plugin);
    this.registerPlugin(plugin);
    apply()(pluginCtx, opts);

    // this.checkPluginOpts(pluginCtx, opts);
  }

  registerPlugin(plugin: IPlugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`插件 ${plugin.id} 已被注册`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  initPluginCtx({ id, path, ctx }: { id: string; path: string; ctx: Kernel }) {
    const pluginCtx = new Plugin({ id, path, ctx });
    const internalMethods = ['onReady', 'onStart'];
    const kernelApis = ['appPath', 'plugins', 'paths', 'config', 'initialConfig', 'applyPlugins'];
    internalMethods.forEach((name) => {
      if (!this.methods.has(name)) {
        pluginCtx.registerMethod(name);
      }
    });
    return new Proxy(pluginCtx, {
      get: (target, name: string) => {
        if (this.methods.has(name)) {
          const method = this.methods.get(name);
          if (Array.isArray(method)) {
            return (...arg) => {
              method.forEach((item) => {
                item.apply(this, arg);
              });
            };
          }
          return method;
        }
        if (kernelApis.includes(name)) {
          return typeof this[name] === 'function' ? this[name].bind(this) : this[name];
        }
        return target[name];
      }
    });
  }

  async applyPlugins(args: string | { name: string; initialVal?: any; opts?: any }) {
    let name;
    let initialVal;
    let opts;
    if (typeof args === 'string') {
      name = args;
    } else {
      name = args.name;
      initialVal = args.initialVal;
      opts = args.opts;
    }
    this.debugger('applyPlugins');
    this.debugger(`applyPlugins:name:${name}`);
    this.debugger(`applyPlugins:initialVal:${initialVal}`);
    this.debugger(`applyPlugins:opts:${opts}`);

    if (typeof name !== 'string') {
      throw new Error('调用失败，未传入正确的名称！');
    }

    const hooks = this.hooks.get(name) || [];
    const waterfall = new AsyncSeriesWaterfallHook(['arg']);
    if (hooks.length) {
      const resArr: any[] = [];
      for (const hook of hooks) {
        waterfall.tapPromise(
          {
            name: hook.plugin!,
            stage: hook.stage || 0,
            before: hook.before
          },
          async (arg) => {
            const res = await hook.fn(opts, arg);
            if (IS_MODIFY_HOOK.test(name) && IS_EVENT_HOOK.test(name)) {
              return res;
            }
            if (IS_ADD_HOOK.test(name)) {
              resArr.push(res);
              return resArr;
            }
            return null;
          }
        );
      }
    }
    return await waterfall.promise(initialVal);
  }

  async run(opts: string | { name: string; args?: any }) {
    let name: string;
    let args;
    if (typeof opts === 'string') {
      name = args;
    } else {
      name = opts.name;
      args = opts?.args;
    }

    await this.init();
    this.debugger('command:onStart');
    await this.applyPlugins('onStart');

    if (!this.commands.has(name)) {
      throw new Error(`${name} 命令不存在`);
    }

    await this.applyPlugins({
      name,
      opts
    });
  }
}
