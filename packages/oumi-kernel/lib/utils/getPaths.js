"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const fs_1 = require("fs");
const path_1 = require("path");
function isDirectoryAndExist(path) {
    return (0, fs_1.existsSync)(path) && (0, fs_1.statSync)(path).isDirectory();
}
function normalizeWithWinPath(obj) {
    return cli_shared_utils_1.lodash.mapValues(obj, (value) => (0, cli_shared_utils_1.winPath)(value));
}
function getServicePaths({ appPath, config, env, }) {
    let absSrcPath = appPath;
    if (isDirectoryAndExist((0, path_1.join)(appPath, 'src'))) {
        absSrcPath = (0, path_1.join)(appPath, 'src');
    }
    const absPagesPath = (0, path_1.join)(absSrcPath, 'pages');
    const tmpDir = ['.oumi', env !== 'development' && env]
        .filter(Boolean)
        .join('-');
    return normalizeWithWinPath({
        appPath,
        absNodeModulesPath: (0, path_1.join)(appPath, 'node_modules'),
        absOutputPath: (0, path_1.join)(appPath, config.outputPath || './dist'),
        absSrcPath,
        absPagesPath,
        absTmpPath: (0, path_1.join)(absSrcPath, tmpDir),
    });
}
exports.default = getServicePaths;
