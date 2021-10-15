"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deps_1 = require("../connectors/deps");
exports.default = (socket) => {
    const context = {
        pubsub: {
            publish: (channels, content) => {
                socket.emit(channels, content);
                socket.broadcast.emit(channels, content);
            }
        }
    };
    socket.on('get_project_deps', async () => {
        await deps_1.getProjectDeps(context);
        socket.emit('get_project_deps_done');
    });
    socket.on('install_dep', async ({ id, type }) => {
        await deps_1.install({ id, type }, context);
        await deps_1.getProjectDeps(context);
        socket.emit('get_project_deps_done');
    });
    socket.on('uninstall_dep', async ({ id }) => {
        const current = await deps_1.uninstall({ id }, context);
        socket.emit('uninstall_dep_done', current);
    });
    socket.on('update_dep', async ({ id }) => {
        const current = await deps_1.update({ id }, context);
        socket.emit('update_dep_done', current);
    });
    deps_1.setup(context);
};
