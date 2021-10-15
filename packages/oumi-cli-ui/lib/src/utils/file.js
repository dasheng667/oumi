"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfigFile = exports.load = exports.openInEditor = void 0;
const path_1 = __importDefault(require("path"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
async function openInEditor(input = {}) {
    let query;
    if (input.gitPath) {
    }
    else {
        query = input.file;
    }
    if (input.line) {
        query += `:${input.line}`;
        if (input.column) {
            query += `:${input.column}`;
        }
    }
    cli_shared_utils_1.launch(query);
    return true;
}
exports.openInEditor = openInEditor;
function load(file) {
    const module = require(file);
    if (module.default) {
        return module.default;
    }
    return module;
}
exports.load = load;
const loadCache = new Map();
const configFileName = '.racconfig.js';
function readConfigFile(file, fileName = configFileName, force) {
    if (!file)
        return null;
    if (!force) {
        const cachedValue = loadCache.get(file);
        if (cachedValue) {
            return cachedValue;
        }
    }
    const pkgFile = path_1.default.join(file, fileName);
    if (cli_shared_utils_1.fsExtra.existsSync(pkgFile)) {
        const pkg = require(pkgFile);
        loadCache.set(file, pkg);
        return pkg;
    }
    return null;
}
exports.readConfigFile = readConfigFile;
