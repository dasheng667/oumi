const tasks = require('../connectors/task');
const modelDb = require('../db/modelDb');
const { readPackage } = require('../connectors/folders');

module.exports = (socket) => {
  const context = {
    pubsub: {
      publish: (channels, content) => {
        socket.emit(channels, content);
        socket.broadcast.emit(channels, content);
      }
    }
  };

  // 获取id下所有logs
  socket.on('get_tasks_list', async (id) => {
    const current = modelDb.projectList.findCurrent();
    if (current && current.path) {
      const pkg = readPackage(current.path);
      if (pkg) {
        const list = (await tasks.list({ file: current.path })) || [];
        const list2 = list
          .filter((item) => item.path === current.path)
          .map((item) => {
            const item2 = { ...item };
            delete item2.logs;
            delete item2.child;
            return item2;
          });
        socket.emit('get_tasks_list', list2);
      } else {
        socket.emit('get_tasks_list', []);
      }
    } else {
      socket.emit('get_tasks_list', []);
    }
  });

  // 监听运行的任务
  socket.on('run_tasks', (id) => {
    // 执行任务函数
    tasks.run(id, context);
  });

  socket.on('stop_tasks', (id) => {
    tasks.stop(id, context);
  });

  socket.on('clear_logs', (id) => {
    tasks.clearLogs(id);
  });

  // 获取id下所有logs
  socket.on('get_task_logs', (id) => {
    const logs = tasks.findLogs(id);
    socket.emit('get_task_logs', id, logs);
  });
};
