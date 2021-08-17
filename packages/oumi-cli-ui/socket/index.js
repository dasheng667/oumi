const tasks = require('../connectors/task');

module.exports = (socket) => {
  // 监听运行的任务
  socket.on('run_tasks', (id) => {
    // 执行任务函数
    tasks.run(id, {
      pubsub: {
        publish: (channels, content) => {
          // 发送给客户端
          socket.emit(channels, content);
        }
      }
    });
  });

  socket.on('stop_tasks', (id) => {
    tasks.stop(id, {
      pubsub: {
        publish: (channels, content) => {
          // 发送给客户端
          socket.emit(channels, content);
        }
      }
    });
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
