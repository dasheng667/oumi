import path from 'path';
import resolve from 'resolve';
import { getModuleExport, lodash } from '@oumi/cli-shared-utils';
import type { IPresetItem, PluginType, IPlugin } from '../../typings/type';

export const isNpmPkg: (name: string) => boolean = (name) => !/^(\.|\/)/.test(name);

export function getPluginPath(pluginPath: string) {
  if (isNpmPkg(pluginPath) || path.isAbsolute(pluginPath)) return pluginPath;
  throw new Error('plugin 和 preset 配置必须为绝对路径或者包名');
}

export function convertPluginsToObject(items: IPresetItem[]) {
  return () => {
    const obj: any = {};
    if (Array.isArray(items)) {
      items.forEach((item) => {
        if (typeof item === 'string') {
          const name = getPluginPath(item);
          obj[name] = null;
        } else if (Array.isArray(item)) {
          const name = getPluginPath(item[0]);
          // eslint-disable-next-line prefer-destructuring
          obj[name] = item[1];
        }
      });
    }
    return obj;
  };
}

export function mergePlugins(dist: IPresetItem[], src: IPresetItem[]) {
  return () => {
    const srcObj = convertPluginsToObject(src)();
    const distObj = convertPluginsToObject(dist)();
    return lodash.merge(distObj, srcObj);
  };
}

// getModuleExport
export function resolvePresetsOrPlugins(root: string, args, type: PluginType): IPlugin[] {
  return Object.keys(args).map((item) => {
    const fPath = resolve.sync(item, {
      basedir: root,
      extensions: ['.js', '.ts']
    });
    return {
      id: fPath,
      path: fPath,
      type,
      opts: args[item] || {},
      apply() {
        return getModuleExport(require(fPath));
      }
    };
  });
}
