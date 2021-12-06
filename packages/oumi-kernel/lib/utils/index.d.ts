import type { IPresetItem, PluginType, IPlugin } from '../../typings/type';
export declare const isNpmPkg: (name: string) => boolean;
export declare function getPluginPath(pluginPath: string): string;
export declare function convertPluginsToObject(items: IPresetItem[]): () => any;
export declare function mergePlugins(dist: IPresetItem[], src: IPresetItem[]): () => any;
export declare function resolvePresetsOrPlugins(root: string, args: any, type: PluginType): IPlugin[];
