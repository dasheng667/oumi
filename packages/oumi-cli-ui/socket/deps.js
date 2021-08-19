const { getProjectDeps, install, uninstall, update } = require('../connectors/deps');
const modelDb = require('../db/modelDb');

module.exports = (socket) => {
  const context = {
    pubsub: {
      publish: (channels, content) => {
        socket.emit(channels, content);
      }
    }
  };

  socket.on('get_project_deps', async () => {
    await getProjectDeps(context);
    socket.emit('get_project_deps_done');
  });

  socket.on('install_dep', async ({ id, type }) => {
    const current = await install({ id, type }, context);
    socket.emit('get_project_deps', { data: current });
  });

  socket.on('uninstall_dep', async ({ id }) => {
    const current = await uninstall({ id }, context);
    socket.emit('uninstall_dep_done', current);
  });

  socket.on('update_dep', async ({ id }) => {
    const current = await update({ id }, context);
    socket.emit('update_dep_done', current);
  });
};
