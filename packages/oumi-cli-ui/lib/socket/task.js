'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const tasks = __importStar(require('../connectors/task'));
const db_1 = __importDefault(require('../model/db'));
const folders_1 = require('../connectors/folders');
exports.default = (socket) => {
  const context = {
    pubsub: {
      publish: (channels, content) => {
        socket.emit(channels, content);
        socket.broadcast.emit(channels, content);
      }
    }
  };
  socket.on('get_tasks_list', async (id) => {
    const current = db_1.default.projectList.findCurrent();
    if (current && current.path) {
      const pkg = folders_1.readPackage(current.path);
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
  socket.on('run_tasks', (id) => {
    tasks.run(id, context);
  });
  socket.on('stop_tasks', (id) => {
    tasks.stop(id, context);
  });
  socket.on('clear_logs', (id) => {
    tasks.clearLogs(id);
  });
  socket.on('get_task_logs', (id) => {
    const logs = tasks.findLogs(id);
    socket.emit('get_task_logs', id, logs);
  });
};
