"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const DEFAULT_CONFIG_FILES = ['.oumi.config.ts', '.oumi.config.js', 'config/config.ts', 'config/config.js'];
class Config {
    appPath;
    configFiles = DEFAULT_CONFIG_FILES;
    initialConfig;
    constructor(opts) {
        this.appPath = opts.appPath || process.cwd();
        if (Array.isArray(opts.configFiles)) {
            this.configFiles = Array.from(new Set([...this.configFiles, ...opts.configFiles]));
        }
        this.initialConfig = this.getUserConfig();
    }
    getConfigFile() {
        const configFile = this.configFiles.find((f) => (0, fs_1.existsSync)((0, path_1.join)(this.appPath, f)));
        return configFile ? (0, cli_shared_utils_1.winPath)(configFile) : null;
    }
    getUserConfig() {
        const file = this.getConfigFile();
        if (file) {
            return (0, cli_shared_utils_1.getModuleExport)(require((0, path_1.join)(this.appPath, file)));
        }
        return {};
    }
}
exports.default = Config;
