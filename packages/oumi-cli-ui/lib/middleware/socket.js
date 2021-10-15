"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolve = (dir) => {
    return path_1.default.resolve(__dirname, '../', dir);
};
function addSockets(socket, app, dir) {
    const files = fs_1.default.readdirSync(resolve(dir));
    const js_files = files.filter((f) => {
        return f.endsWith('.ts') || f.endsWith('.js');
    });
    for (const f of js_files) {
        const socketFile = require(resolve(`${dir}/${f}`)).default;
        socketFile(socket, app);
    }
}
exports.default = (io, app) => {
    io.on('connection', (socket) => {
        addSockets(socket, app, 'socket');
    });
    io.on('error', (error) => {
        throw new Error(error);
    });
    return async function model(ctx, next) {
        await next();
    };
};
