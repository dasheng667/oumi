/// <reference types="node" />
import { EventEmitter } from 'events';
import Config from './Config';
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
    commands: Map<string, ICommand | string>;
    plugins: Map<string, IPlugin>;
    pluginMethods: Map<string, void>;
    optsPresets: IPresetItem[];
    extraPlugins: IPlugin[];
    optsPlugins: IPresetItem[];
    userConfig: Config;
    hooks: Map<string, IHook[]>;
    methods: Map<string, ((...args: any[]) => void)[]>;
    paths: {
        appPath?: string;
        absNodeModulesPath?: string;
        absSrcPath?: string;
        absPagesPath?: string;
        absOutputPath?: string;
        absTmpPath?: string;
    };
    args: any;
    debugger: any;
    config: any;
    constructor(options: IKernelOptions);
    init(): Promise<void>;
    initConfig(): void;
    initPresetsAndPlugins(): void;
    resolvePresets(presets: any): void;
    resolvePlugins(plugins: any): void;
    initPreset(preset: IPlugin): void;
    initPlugin(plugin: IPlugin): void;
    registerPlugin(plugin: IPlugin): void;
    initPluginCtx({ id, path, ctx }: {
        id: string;
        path: string;
        ctx: Kernel;
    }): Plugin;
    applyPlugins(args: string | {
        name: string;
        initialVal?: any;
        opts?: any;
    }): Promise<unknown>;
    run(opts: string | {
        name: string;
        args?: any;
    }): Promise<void>;
}
export {};
