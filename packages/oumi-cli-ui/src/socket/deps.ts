import { getProjectDeps, install, uninstall, update, setup } from '../connectors/deps';

export default (socket: any) => {
  const context = {
    pubsub: {
      publish: (channels: string, content: any) => {
        socket.emit(channels, content);
        socket.broadcast.emit(channels, content);
      }
    }
  };

  socket.on('get_project_deps', async () => {
    await getProjectDeps(context);
    socket.emit('get_project_deps_done');
  });

  socket.on('install_dep', async ({ id, type }: any) => {
    await install({ id, type }, context);
    await getProjectDeps(context);
    socket.emit('get_project_deps_done');
  });

  socket.on('uninstall_dep', async ({ id }: any) => {
    const current = await uninstall({ id }, context);
    socket.emit('uninstall_dep_done', current);
  });

  socket.on('update_dep', async ({ id }: any) => {
    const current = await update({ id }, context);
    socket.emit('update_dep_done', current);
  });

  setup(context);
};
