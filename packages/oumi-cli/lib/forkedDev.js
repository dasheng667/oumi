"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const kernel_1 = require("@oumi/kernel");
const index_1 = __importDefault(require("./plugins/index"));
(async () => {
    try {
        const args = (0, cli_shared_utils_1.yParser)(process.argv.slice(2));
        const { type } = args;
        process.env.NODE_ENV = 'development';
        const kernel = new kernel_1.Kernel({
            appPath: (0, cli_shared_utils_1.getCwd)(),
            pkg: (0, cli_shared_utils_1.resolvePkg)(process.cwd()),
            presets: [...(0, index_1.default)().plugins]
        });
        await kernel.run({
            name: 'dev',
            args
        });
        let closed = false;
        function onSignal(signal) {
            if (closed)
                return;
            closed = true;
        }
        process.once('SIGINT', () => onSignal('SIGINT'));
        process.once('SIGQUIT', () => onSignal('SIGQUIT'));
        process.once('SIGTERM', () => onSignal('SIGTERM'));
    }
    catch (e) {
        console.error(cli_shared_utils_1.chalk.red(e.message));
        console.error(e.stack);
        process.exit(1);
    }
})();
