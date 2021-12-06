"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dev_config_1 = __importDefault(require("./config/dev.config"));
async function runDev(appPath, config) {
    const conf = (0, dev_config_1.default)(appPath, config);
    console.log('conf', conf);
}
exports.default = (appPath, config) => {
    const { watch } = config || {};
    if (watch) {
        try {
            runDev(appPath, config);
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        try {
            runDev(appPath, config);
        }
        catch (e) {
            console.error(e);
        }
    }
};
