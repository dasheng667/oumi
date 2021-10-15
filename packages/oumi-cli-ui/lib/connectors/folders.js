"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidatePackage = exports.readPackage = void 0;
const path_1 = __importDefault(require("path"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const pkgCache = new cli_shared_utils_1.LRU({
    max: 500,
    maxAge: 1000 * 5
});
function readPackage(file, context, force = false) {
    if (file === null)
        return null;
    if (!force) {
        const cachedValue = pkgCache.get(file);
        if (cachedValue) {
            return cachedValue;
        }
    }
    const pkgFile = path_1.default.join(file, 'package.json');
    if (cli_shared_utils_1.fsExtra.existsSync(pkgFile)) {
        const pkg = cli_shared_utils_1.fsExtra.readJsonSync(pkgFile);
        pkgCache.set(file, pkg);
        return pkg;
    }
}
exports.readPackage = readPackage;
function invalidatePackage(file) {
    if (file) {
        pkgCache.del(file);
    }
    return true;
}
exports.invalidatePackage = invalidatePackage;
