/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const { chalk, execa } = require('@oumi/cli-shared-utils');
const channels = require('./channels');
const folders = require('./folders');
const terminate = require('../utils/terminate');
const cwd = require('./cwd');
const { log, parseArgs } = require('../utils');

const MAX_LOGS = 2000;
const WIN_ENOENT_THRESHOLD = 500; // ms
const tasks = new Map();

function getTasks(file = null) {
  if (!file) file = cwd.get();
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
      // updateViewBadges({
      //   task,
      //   data
      // }, context)
    }

    Object.assign(task, data);
    context.pubsub.publish(channels.TASK_CHANGED, {
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
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(flush, maxTime);
    }
  };

  const flush = () => {
    clearTimeout(timeout);
    if (!size) return;
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
  if (!file) file = cwd.get();
  let list = getTasks(file);
  const pkg = folders.readPackage(file, context);
  if (pkg.scripts) {
    const existing = new Map();

    // if (projects.getType(file, context) === 'vue') {
    //   await plugins.list(file, context, { resetApi: false, lightApi: true })
    // }

    // const pluginApi = api && plugins.getApi(file)

    // Get current valid tasks in project `package.json`
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

    // Process existing tasks
    const existingTasks = currentTasks.filter((task) => task.index !== -1);
    // Update tasks data
    existingTasks.forEach((task) => {
      Object.assign(list[task.index], task);
    });

    // Process removed tasks
    // const removedTasks = list.filter((t) => currentTasks.findIndex((c) => c.id === t.id) === -1);
    // Remove badges
    // removedTasks.forEach((task) => {
    //   updateViewBadges({ task }, context);
    // });

    // Process new tasks
    const newTasks = currentTasks
      .filter((task) => task.index === -1)
      .map((task) => ({
        ...task,
        status: 'idle',
        child: null,
        logs: []
      }));

    // Keep existing running tasks
    list = list.filter((task) => existing.get(task.id) || task.status === 'running');

    // Add the new tasks
    list = list.concat(newTasks);

    // Sort
    const getSortScore = (task) => {
      const index = scriptKeys.indexOf(task.name);
      if (index !== -1) return index;
      return Infinity;
    };
    list.sort((a, b) => getSortScore(a) - getSortScore(b));

    tasks.set(file, list);
  }
  return list;
}

function findOne(id, context) {
  for (const [, list] of tasks) {
    const result = list.find((t) => t.id === id);
    if (result) return result;
  }
}

function addLog(log, context) {
  const task = findOne(log.taskId, context);
  if (task) {
    if (task.logs.length === MAX_LOGS) {
      task.logs.shift();
    }
    task.logs.push(log);
    context.pubsub.publish(channels.TASK_LOG_ADDED, {
      taskLogAdded: log
    });
  }
}

async function run(id, context) {
  let command = null;
  let args = null;
  const task = findOne(id, context);

  const outPipe = logPipe((queue) => {
    // console.log('outPipe>>>', context);
    addLog(
      {
        taskId: task.id,
        type: 'stdout',
        text: queue
      },
      context
    );
  });

  const errPipe = logPipe((queue) => {
    addLog(
      {
        taskId: task.id,
        type: 'stderr',
        text: queue
      },
      context
    );
  });

  const onExit = async (code, signal) => {
    outPipe.flush();
    errPipe.flush();

    log('Task exit', command, args, 'code:', code, 'signal:', signal);

    const duration = Date.now() - task.time;
    const seconds = Math.round(duration / 10) / 100;
    addLog(
      {
        taskId: task.id,
        type: 'stdout',
        text: chalk.grey(`Total task duration: ${seconds}s`)
      },
      context
    );

    // Plugin API
    if (task.onExit) {
      await task.onExit({
        args,
        child,
        cwd: cwd.get(),
        code,
        signal
      });
    }

    if (code === null || task._terminating) {
      updateOne(
        {
          id: task.id,
          status: 'terminated'
        },
        context
      );
    } else if (code !== 0) {
      updateOne(
        {
          id: task.id,
          status: 'error'
        },
        context
      );
    } else {
      updateOne(
        {
          id: task.id,
          status: 'done'
        },
        context
      );
    }

    // plugins.callHook(
    //   {
    //     id: 'taskExit',
    //     args: [
    //       {
    //         task,
    //         args,
    //         child,
    //         cwd: cwd.get(),
    //         signal,
    //         code
    //       }
    //     ],
    //     file: cwd.get()
    //   },
    //   context
    // );
  };

  if (task && task.status !== 'running') {
    task._terminating = false;

    // eslint-disable-next-line prefer-const
    let [command2, ...args2] = parseArgs(task.command);
    command = command2;
    args = args2;

    // Deduplicate arguments
    const dedupedArgs = [];
    for (let i = args.length - 1; i >= 0; i--) {
      const arg = args[i];
      if (typeof arg === 'string' && arg.indexOf('--') === 0) {
        if (dedupedArgs.indexOf(arg) === -1) {
          dedupedArgs.push(arg);
        } else {
          const value = args[i + 1];
          if (value && value.indexOf('--') !== 0) {
            dedupedArgs.pop();
          }
        }
      } else {
        dedupedArgs.push(arg);
      }
    }
    args = dedupedArgs.reverse();

    if (command === 'npm') {
      args.splice(0, 0, '--');
    }

    updateOne(
      {
        id: task.id,
        status: 'running'
      },
      context
    );

    addLog(
      {
        taskId: task.id,
        type: 'stdout',
        text: chalk.grey(`$ ${command} ${args.join(' ')}`)
      },
      context
    );

    task.time = Date.now();

    const child = execa(command, args, {
      cwd: cwd.get(),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });

    if (typeof nodeEnv !== 'undefined') {
      process.env.NODE_ENV = nodeEnv;
    }

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
        return onExit(null);
      }
      updateOne(
        {
          id: task.id,
          status: 'error'
        },
        context
      );

      addLog(
        {
          taskId: task.id,
          type: 'stdout',
          text: chalk.red(`Error while running task ${task.id} with message '${error.message}'`)
        },
        context
      );
      console.error(error);
    });

    // Plugin API
    if (task.onRun) {
      await task.onRun({
        args,
        child,
        cwd: cwd.get()
      });
    }
  }
  // if (task && task.status === 'running') {
  //   const { child } = task;
  //   const [command2, ...args2] = parseArgs(task.command);
  //   command = command2;
  //   args = args2;

  //   child.stdout.on('data', (buffer) => {
  //     outPipe.add(buffer.toString());
  //   });

  //   child.stderr.on('data', (buffer) => {
  //     errPipe.add(buffer.toString());
  //   });

  //   child.on('exit', onExit);

  //   child.on('error', (error) => {
  //     const duration = Date.now() - task.time;
  //     if (process.platform === 'win32' && error.code === 'ENOENT' && duration > WIN_ENOENT_THRESHOLD) {
  //       return onExit(null);
  //     }
  //     updateOne(
  //       {
  //         id: task.id,
  //         status: 'error'
  //       },
  //       context
  //     );

  //     addLog(
  //       {
  //         taskId: task.id,
  //         type: 'stdout',
  //         text: chalk.red(`Error while running task ${task.id} with message '${error.message}'`)
  //       },
  //       context
  //     );
  //     console.error(error);
  //   });
  // }
  return task;
}

async function stop(id, context) {
  const task = findOne(id, context);
  if (task && task.status === 'running' && task.child) {
    task._terminating = true;
    try {
      const { success, error } = await terminate(task.child, cwd.get());
      if (success) {
        updateOne(
          {
            id: task.id,
            status: 'terminated'
          },
          context
        );
      } else if (error) {
        updateOne(
          {
            id: task.id,
            status: 'error'
          },
          context
        );
        throw error;
      } else {
        throw new Error('Unknown error');
      }
    } catch (e) {
      console.log(chalk.red(`Can't terminate process ${task.child.pid}`));
      console.error(e);
    }
  } else {
    updateOne(
      {
        id: task.id,
        status: 'error'
      },
      context
    );
  }
  return task;
}

function clearLogs(id, context) {
  const task = findOne(id, context);
  if (task) {
    task.logs = [];
  }
  return task;
}

function findLogs(id, context) {
  const task = findOne(id, context);
  return task ? task.logs : null;
}

module.exports = {
  run,
  list,
  stop,
  clearLogs,
  findLogs
};
