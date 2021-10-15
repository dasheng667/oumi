"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLogs = exports.clearLogs = exports.stop = exports.run = exports.list = void 0;
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const channels_1 = __importDefault(require("./channels"));
const folders = __importStar(require("./folders"));
const terminate_1 = __importDefault(require("../utils/terminate"));
const cwd_1 = __importDefault(require("./cwd"));
const utils_1 = require("../utils");
const MAX_LOGS = 2000;
const WIN_ENOENT_THRESHOLD = 500;
const tasks = new Map();
function getTasks(file = null) {
    if (!file)
        file = cwd_1.default.get();
    let list = tasks.get(file);
    if (!list) {
        list = [];
        tasks.set(file, list);
    }
    return list;
}
function updateOne(data, context) {
    const task = findOne(data.id);
    if (task) {
        if (task.status !== data.status) {
        }
        Object.assign(task, data);
        context.pubsub.publish(channels_1.default.TASK_CHANGED, {
            taskChanged: task
        });
    }
    return task;
}
function logPipe(action) {
    const maxTime = 300;
    let queue = '';
    let size = 0;
    let time = Date.now();
    let timeout;
    const add = (string) => {
        queue += string;
        size++;
        if (size === 50 || Date.now() > time + maxTime) {
            flush();
        }
        else {
            clearTimeout(timeout);
            timeout = setTimeout(flush, maxTime);
        }
    };
    const flush = () => {
        clearTimeout(timeout);
        if (!size)
            return;
        action(queue);
        queue = '';
        size = 0;
        time = Date.now();
    };
    return {
        add,
        flush
    };
}
async function list({ file = null, api = true } = {}, context) {
    if (!file)
        file = cwd_1.default.get();
    let list = getTasks(file);
    const pkg = folders.readPackage(file, context);
    if (pkg.scripts) {
        const existing = new Map();
        const scriptKeys = Object.keys(pkg.scripts);
        const currentTasks = scriptKeys.map((name) => {
            const id = `${file}:${name}`;
            existing.set(id, true);
            const command = pkg.scripts[name];
            return {
                id,
                name,
                command,
                index: list.findIndex((t) => t.id === id),
                prompts: [],
                views: [],
                path: file
            };
        });
        const existingTasks = currentTasks.filter((task) => task.index !== -1);
        existingTasks.forEach((task) => {
            Object.assign(list[task.index], task);
        });
        const newTasks = currentTasks
            .filter((task) => task.index === -1)
            .map((task) => ({
            ...task,
            status: 'idle',
            child: null,
            logs: []
        }));
        list = list.filter((task) => existing.get(task.id) || task.status === 'running');
        list = list.concat(newTasks);
        const getSortScore = (task) => {
            const index = scriptKeys.indexOf(task.name);
            if (index !== -1)
                return index;
            return Infinity;
        };
        list.sort((a, b) => getSortScore(a) - getSortScore(b));
        tasks.set(file, list);
    }
    return list;
}
exports.list = list;
function findOne(id) {
    for (const [, list] of tasks) {
        const result = list.find((t) => t.id === id);
        if (result)
            return result;
    }
    return null;
}
function addLog(log, context) {
    const task = findOne(log.taskId);
    if (task) {
        if (task.logs.length === MAX_LOGS) {
            task.logs.shift();
        }
        task.logs.push(log);
        context.pubsub.publish(channels_1.default.TASK_LOG_ADDED, {
            taskLogAdded: log
        });
    }
}
async function run(id, context) {
    let command = null;
    let args = null;
    const child = null;
    const task = findOne(id);
    const outPipe = logPipe((queue) => {
        addLog({
            taskId: task.id,
            type: 'stdout',
            text: queue
        }, context);
    });
    const errPipe = logPipe((queue) => {
        addLog({
            taskId: task.id,
            type: 'stderr',
            text: queue
        }, context);
    });
    const onExit = async (code, signal) => {
        outPipe.flush();
        errPipe.flush();
        utils_1.log('Task exit', command, args, 'code:', code, 'signal:', signal);
        const duration = Date.now() - task.time;
        const seconds = Math.round(duration / 10) / 100;
        addLog({
            taskId: task.id,
            type: 'stdout',
            text: cli_shared_utils_1.chalk.grey(`Total task duration: ${seconds}s`)
        }, context);
        if (task.onExit) {
            await task.onExit({
                args,
                child,
                cwd: cwd_1.default.get(),
                code,
                signal
            });
        }
        if (code === null || task._terminating) {
            updateOne({
                id: task.id,
                status: 'terminated'
            }, context);
        }
        else if (code !== 0) {
            updateOne({
                id: task.id,
                status: 'error'
            }, context);
        }
        else {
            updateOne({
                id: task.id,
                status: 'done'
            }, context);
        }
    };
    if (task && task.status !== 'running') {
        task._terminating = false;
        let [command2, ...args2] = utils_1.parseArgs(task.command);
        command = command2;
        args = args2;
        const dedupedArgs = [];
        for (let i = args.length - 1; i >= 0; i--) {
            const arg = args[i];
            if (typeof arg === 'string' && arg.indexOf('--') === 0) {
                if (dedupedArgs.indexOf(arg) === -1) {
                    dedupedArgs.push(arg);
                }
                else {
                    const value = args[i + 1];
                    if (value && value.indexOf('--') !== 0) {
                        dedupedArgs.pop();
                    }
                }
            }
            else {
                dedupedArgs.push(arg);
            }
        }
        args = dedupedArgs.reverse();
        if (command === 'npm') {
            args.splice(0, 0, '--');
        }
        updateOne({
            id: task.id,
            status: 'running'
        }, context);
        addLog({
            taskId: task.id,
            type: 'stdout',
            text: cli_shared_utils_1.chalk.grey(`$ ${command} ${args.join(' ')}`)
        }, context);
        task.time = Date.now();
        const child = cli_shared_utils_1.execa(command, args, {
            cwd: cwd_1.default.get(),
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true
        });
        task.child = child;
        child.stdout.on('data', (buffer) => {
            outPipe.add(buffer.toString());
        });
        child.stderr.on('data', (buffer) => {
            errPipe.add(buffer.toString());
        });
        child.on('exit', onExit);
        child.on('error', (error) => {
            const duration = Date.now() - task.time;
            if (process.platform === 'win32' && error.code === 'ENOENT' && duration > WIN_ENOENT_THRESHOLD) {
                onExit(null, '');
                return;
            }
            updateOne({
                id: task.id,
                status: 'error'
            }, context);
            addLog({
                taskId: task.id,
                type: 'stdout',
                text: cli_shared_utils_1.chalk.red(`Error while running task ${task.id} with message '${error.message}'`)
            }, context);
            console.error(error);
        });
        if (task.onRun) {
            await task.onRun({
                args,
                child,
                cwd: cwd_1.default.get()
            });
        }
    }
    return task;
}
exports.run = run;
async function stop(id, context) {
    const task = findOne(id);
    if (task && task.status === 'running' && task.child) {
        task._terminating = true;
        try {
            const { success, error } = await terminate_1.default(task.child, cwd_1.default.get());
            if (success) {
                updateOne({
                    id: task.id,
                    status: 'terminated'
                }, context);
            }
            else if (error) {
                updateOne({
                    id: task.id,
                    status: 'error'
                }, context);
                throw error;
            }
            else {
                throw new Error('Unknown error');
            }
        }
        catch (e) {
            console.log(cli_shared_utils_1.chalk.red(`Can't terminate process ${task.child.pid}`));
            console.error(e);
        }
    }
    else {
        updateOne({
            id: task.id,
            status: 'error'
        }, context);
    }
    return task;
}
exports.stop = stop;
function clearLogs(id) {
    const task = findOne(id);
    if (task) {
        task.logs = [];
    }
    return task;
}
exports.clearLogs = clearLogs;
function findLogs(id) {
    const task = findOne(id);
    return task ? task.logs : null;
}
exports.findLogs = findLogs;
