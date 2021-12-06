"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePresetsOrPlugins = exports.mergePlugins = exports.convertPluginsToObject = exports.getPluginPath = exports.isNpmPkg = void 0;
const path_1 = __importDefault(require("path"));
const resolve_1 = __importDefault(require("resolve"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const isNpmPkg = (name) => !/^(\.|\/)/.test(name);
exports.isNpmPkg = isNpmPkg;
function getPluginPath(pluginPath) {
    if ((0, exports.isNpmPkg)(pluginPath) || path_1.default.isAbsolute(pluginPath))
        return pluginPath;
    throw new Error('plugin 和 preset 配置必须为绝对路径或者包名');
}
exports.getPluginPath = getPluginPath;
function convertPluginsToObject(items) {
    return () => {
        const obj = {};
        if (Array.isArray(items)) {
            items.forEach((item) => {
                if (typeof item === 'string') {
                    const name = getPluginPath(item);
                    obj[name] = null;
                }
                else if (Array.isArray(item)) {
                    const name = getPluginPath(item[0]);
                    // eslint-disable-next-line prefer-destructuring
                    obj[name] = item[1];
                }
            });
        }
        return obj;
    };
}
exports.convertPluginsToObject = convertPluginsToObject;
function mergePlugins(dist, src) {
    return () => {
        const srcObj = convertPluginsToObject(src)();
        const distObj = convertPluginsToObject(dist)();
        return cli_shared_utils_1.lodash.merge(distObj, srcObj);
    };
}
exports.mergePlugins = mergePlugins;
// getModuleExport
function resolvePresetsOrPlugins(root, args, type) {
    return Object.keys(args).map((item) => {
        const fPath = resolve_1.default.sync(item, {
            basedir: root,
            extensions: ['.js', '.ts']
        });
        return {
            id: fPath,
            path: fPath,
            type,
            opts: args[item] || {},
            apply() {
                return (0, cli_shared_utils_1.getModuleExport)(require(fPath));
            }
        };
    });
}
exports.resolvePresetsOrPlugins = resolvePresetsOrPlugins;
