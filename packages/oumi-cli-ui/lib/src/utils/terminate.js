"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const execFile = util_1.default.promisify(child_process_1.default.execFile);
const spawn = util_1.default.promisify(child_process_1.default.spawn);
async function default_1(childProcess, cwd) {
    if (cli_shared_utils_1.isWindows) {
        try {
            const options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            if (cwd) {
                options.cwd = cwd;
            }
            await execFile('taskkill', ['/T', '/F', '/PID', childProcess.pid.toString()], options);
        }
        catch (err) {
            return { success: false, error: err };
        }
    }
    else if (cli_shared_utils_1.isLinux || cli_shared_utils_1.isMacintosh) {
        try {
            const cmd = path_1.default.resolve(__dirname, '../../sh/terminate.sh');
            const result = await spawn(cmd, [childProcess.pid.toString()], {
                cwd
            });
            if (result.error) {
                return { success: false, error: result.error };
            }
        }
        catch (err) {
            return { success: false, error: err };
        }
    }
    else {
        childProcess.kill('SIGKILL');
    }
    return { success: true };
}
exports.default = default_1;
