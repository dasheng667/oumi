"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const portfinder_1 = __importDefault(require("portfinder"));
const koa_socket_2_1 = __importDefault(require("koa-socket-2"));
const controllers_1 = __importDefault(require("./middleware/controllers"));
const socket_1 = __importDefault(require("./middleware/socket"));
const cors_1 = __importDefault(require("./middleware/cors"));
const model_1 = __importDefault(require("./middleware/model"));
const extends_1 = __importDefault(require("./middleware/extends"));
const pathJoin = (p) => {
    return path_1.default.join(__dirname, '../', p);
};
exports.default = async (options) => {
    const { port } = options;
    const app = new koa_1.default();
    const io = new koa_socket_2_1.default({
        ioOptions: {
            cors: {
                origin: '*'
            }
        }
    });
    app.use(cors_1.default());
    app.use(extends_1.default());
    app.use(koa_bodyparser_1.default());
    app.use(koa_static_1.default(pathJoin('/public/assets')));
    app.use(koa_static_1.default(pathJoin('/public')));
    app.use(model_1.default());
    io.attach(app);
    app.use(socket_1.default(io, app));
    app.use(controllers_1.default());
    app.use(async (ctx, next) => {
        await next();
        if (!ctx.request.url.startsWith('/api')) {
            ctx.type = 'text/html';
            ctx.body = fs_1.default.readFileSync(pathJoin('/public/index.html'));
        }
    });
    return new Promise((resolve, reject) => {
        portfinder_1.default.basePort = port;
        portfinder_1.default.getPort((err, port2) => {
            if (err) {
                reject(err);
            }
            else {
                app.listen({ port: port2 });
                resolve({ port: port2 });
            }
        });
    });
};
