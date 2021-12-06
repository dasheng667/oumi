"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const webpack_runner_1 = __importDefault(require("@oumi/webpack-runner"));
exports.default = (api) => {
    let port;
    let hostname;
    const { appPath } = api;
    api.registerCommand({
        name: 'dev',
        async fn({ args }) {
            console.log('dev.args', args);
            const defaultPort = process.env.PORT || args?.port || api.config?.devServer?.port;
            port = await cli_shared_utils_1.portfinder.getPortPromise({
                port: defaultPort ? parseInt(String(defaultPort), 10) : 8000
            });
            hostname = process.env.HOST || api.config?.devServer?.host || '0.0.0.0';
            console.log('appPath', appPath);
            console.log('port', port);
            console.log('hostname', hostname);
            const webpack = (0, webpack_runner_1.default)(appPath, {
                watch: true
            });
        }
    });
};
