import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { CodeOutlined, BulbTwoTone, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import Container from '../Container';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useSocket, useEventListener, useRequest } from '../../hook';

import 'xterm/css/xterm.css';

import './index.less';

interface ITaskItem {
  child?: any;
  command: string;
  id: string;
  name: string;
  path: string;
  status: 'idle' | 'error' | 'terminated' | 'done' | 'running' | 'stderr';
  logs: { taskId: string; text: string }[];
}

const defaultTheme = {
  foreground: '#2c3e50',
  background: '#fff',
  cursor: 'rgba(0, 0, 0, .4)',
  selection: 'rgba(0, 0, 0, 0.3)',
  black: '#000000',
  red: '#e83030',
  brightRed: '#e83030',
  green: '#42b983',
  brightGreen: '#42b983',
  brightYellow: '#ea6e00',
  yellow: '#ea6e00',
  magenta: '#e83030',
  brightMagenta: '#e83030',
  cyan: '#03c2e6',
  brightBlue: '#03c2e6',
  brightCyan: '#03c2e6',
  blue: '#03c2e6',
  white: '#d0d0d0',
  brightBlack: '#808080'
};

const term = new Terminal({
  theme: defaultTheme,
  cols: 100,
  rows: 100
});

const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();

term.loadAddon(fitAddon);
term.loadAddon(webLinksAddon);

const setContent = (value: string, ln = true) => {
  if (value.indexOf('\n') !== -1) {
    value.split('\n').forEach((t) => setContent(t));
    return;
  }
  if (typeof value === 'string') {
    term[ln ? 'writeln' : 'write'](value);
  } else {
    term.writeln('');
  }
};

const addLog = (log: any) => {
  setContent(log.text, log.type === 'stdout');
};

export const RenderTerminal = () => {
  const xtermRef: any = useRef(null);

  useEventListener(
    'resize',
    () => {
      fitAddon.fit();
    },
    { target: window }
  );

  useEffect(() => {
    if (xtermRef) {
      term.open(xtermRef.current);
    }
  }, []);

  return <div className="xterm-render" ref={xtermRef} />;
};

const statusMap = {
  idle: '空闲',
  error: '错误',
  terminated: '终止',
  done: '完成',
  running: '运行中',
  stderr: '错误'
};

export default () => {
  const history = useHistory();
  const { socket } = useSocket();
  const [run, setRun] = useState(false);
  const [task, setTask] = useState<ITaskItem | null>(null);
  const { data } = useRequest<ITaskItem[]>('/api/getTasks');

  useEffect(() => {
    const { pathname } = history.location;
    const name = pathname.replace('/tasks/', '');
    if (data) {
      const val = data.find((item) => item.name === name);
      if (val) {
        if (val.id !== task?.id) {
          setTask({ ...val });
          socket.emit('get_task_logs', val.id);
        }
      }
    }
  }, [data, task, history, history.location]);

  useEffect(() => {
    socket.on('task_log_added', (val) => {
      console.log('task_log_added:', val);
      if (val.taskLogAdded) {
        addLog(val.taskLogAdded);
        // setTask({...task, logs: [...task.logs, val.taskLogAdded]});
      } else {
        console.error('not val.taskLogAdded');
      }
      fitAddon.fit();
    });

    socket.on('task_changed', (val) => {
      setRun(false);
      console.log('task_changed:', val);
    });

    socket.on('get_task_logs', (id: string, logs: any) => {
      term.clear();
      if (Array.isArray(logs)) {
        logs.forEach((item: any) => {
          if (id === item.taskId) {
            addLog(item);
          }
        });
      }
    });
  }, []);

  const runTask = () => {
    setRun(true);
    socket.emit('run_tasks', task?.id);
  };

  const setCurrTask = (item: any) => {
    const { name } = item;
    history.push(`/tasks/${name}`);
  };

  const stopTask = () => {
    setRun(false);
    socket.emit('stop_tasks', task?.id);
  };

  const clearLogs = () => {
    term.clear();
    socket.emit('clear_logs', task?.id);
  };

  return (
    <Container title="任务" className="task-container">
      <div className="task-list">
        <ul>
          {data &&
            Array.isArray(data) &&
            data.map((item) => {
              const { id, name, command, status } = item;
              return (
                <li key={id} onClick={() => setCurrTask(item)} className={`${task && task.id === id ? 'active' : ''}`}>
                  <div className="icon">
                    <CodeOutlined />
                  </div>
                  <div className="task-content">
                    <div className="name">
                      {name} <small>[{statusMap[status]}]</small>
                    </div>
                    <div className="desc">{command}</div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="task-scroll">
        <h3>
          <BulbTwoTone /> {task && task.name}
        </h3>
        {task && task.id && (
          <div className="handler">
            {(() => {
              if (task) {
                if (task.status === 'running' || run) {
                  return (
                    <Button type="primary" onClick={() => stopTask()}>
                      <PauseOutlined /> 停止
                    </Button>
                  );
                }
                return (
                  <Button type="primary" onClick={() => runTask()}>
                    <CaretRightOutlined /> 运行
                  </Button>
                );
              }
              return null;
            })()}

            <span className="cur" style={{ marginLeft: 30 }} onClick={clearLogs}>
              清空
            </span>
          </div>
        )}
        {task && task.id && (
          <div className="terminal">
            <p>
              <CodeOutlined /> 输出：
            </p>
            <RenderTerminal />
          </div>
        )}
      </div>
    </Container>
  );
};
