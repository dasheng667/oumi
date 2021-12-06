"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const tapable_1 = require("tapable");
const events_1 = require("events");
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const Config_1 = __importDefault(require("./Config"));
const utils_1 = require("./utils");
const getPaths_1 = __importDefault(require("./utils/getPaths"));
const constants_1 = require("./utils/constants");
const Plugin_1 = __importDefault(require("./Plugin"));
class Kernel extends events_1.EventEmitter {
    appPath;
    pkg;
    // 生命周期 、 注册命令
    commands;
    plugins;
    pluginMethods;
    optsPresets;
    extraPlugins;
    optsPlugins;
    // 用户的配置
    userConfig;
    hooks;
    methods;
    // paths
    paths = {};
    args;
    debugger;
    config;
    constructor(options) {
        super();
        this.debugger = (0, cli_shared_utils_1.createDebug)('Oumi:Kernel');
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
        this.paths = (0, getPaths_1.default)({
            appPath: this.appPath,
            config: this.userConfig,
        });
        this.initPresetsAndPlugins();
        await this.applyPlugins('onReady');
    }
    initConfig() {
        this.userConfig = new Config_1.default({
            appPath: this.appPath
        });
        this.config = this.userConfig.initialConfig;
        this.debugger('initConfig', this.config);
    }
    initPresetsAndPlugins() {
        const { config } = this;
        const allConfigPresets = (0, utils_1.mergePlugins)(this.optsPresets || [], config.presets || [])();
        const allConfigPlugins = (0, utils_1.mergePlugins)(this.optsPlugins || [], config.plugins || [])();
        this.plugins = new Map();
        this.extraPlugins = [];
        this.resolvePresets(allConfigPresets);
        this.resolvePlugins(allConfigPlugins);
    }
    resolvePresets(presets) {
        const allPresets = (0, utils_1.resolvePresetsOrPlugins)(this.appPath, presets, constants_1.PluginType.Preset);
        while (allPresets.length) {
            this.initPreset(allPresets.shift());
        }
    }
    resolvePlugins(plugins) {
        const allPlugins = (0, utils_1.resolvePresetsOrPlugins)(this.appPath, plugins, constants_1.PluginType.Plugin);
        const _plugins = [...allPlugins];
        while (_plugins.length) {
            this.initPlugin(_plugins.shift());
        }
        this.extraPlugins = [];
    }
    initPreset(preset) {
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
    initPlugin(plugin) {
        const { id, path, opts, apply } = plugin;
        const pluginCtx = this.initPluginCtx({ id, path, ctx: this });
        this.debugger('initPlugin', plugin);
        this.registerPlugin(plugin);
        apply()(pluginCtx, opts);
        // this.checkPluginOpts(pluginCtx, opts);
    }
    registerPlugin(plugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`插件 ${plugin.id} 已被注册`);
        }
        this.plugins.set(plugin.id, plugin);
    }
    initPluginCtx({ id, path, ctx }) {
        const pluginCtx = new Plugin_1.default({ id, path, ctx });
        const internalMethods = ['onReady', 'onStart'];
        const kernelApis = ['appPath', 'plugins', 'paths', 'config', 'initialConfig', 'applyPlugins'];
        internalMethods.forEach((name) => {
            if (!this.methods.has(name)) {
                pluginCtx.registerMethod(name);
            }
        });
        return new Proxy(pluginCtx, {
            get: (target, name) => {
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
    async applyPlugins(args) {
        let name;
        let initialVal;
        let opts;
        if (typeof args === 'string') {
            name = args;
        }
        else {
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
        const waterfall = new tapable_1.AsyncSeriesWaterfallHook(['arg']);
        if (hooks.length) {
            const resArr = [];
            for (const hook of hooks) {
                waterfall.tapPromise({
                    name: hook.plugin,
                    stage: hook.stage || 0,
                    before: hook.before
                }, async (arg) => {
                    const res = await hook.fn(opts, arg);
                    if (constants_1.IS_MODIFY_HOOK.test(name) && constants_1.IS_EVENT_HOOK.test(name)) {
                        return res;
                    }
                    if (constants_1.IS_ADD_HOOK.test(name)) {
                        resArr.push(res);
                        return resArr;
                    }
                    return null;
                });
            }
        }
        return await waterfall.promise(initialVal);
    }
    async run(opts) {
        let name;
        let args;
        if (typeof opts === 'string') {
            name = args;
        }
        else {
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
exports.default = Kernel;
