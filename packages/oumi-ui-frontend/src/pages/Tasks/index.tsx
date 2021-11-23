import React, { useState, useEffect, useMemo } from 'react';
import { Button, Tooltip, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  CodeOutlined,
  BulbTwoTone,
  CaretRightOutlined,
  PauseOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import Container from '../Container';
import { useSocket } from '../../hook';
import Terminal, { term, fitAddon } from './Terminal';
import { arrSortByKey, taskViewGroup } from '@src/utils';

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
  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITaskItem | null>(null);
  const [visibleData, setVisibleData] = useState<ITaskItem[]>([]);
  const [data, setData] = useState<ITaskItem[]>([]);

  useEffect(() => {
    // 更新运行状态
    socket.on('task_changed', (changeData: { taskChanged: any }) => {
      setLoading(false);
      if (currentTask && changeData && changeData.taskChanged) {
        const { status } = changeData.taskChanged;
        setCurrentTask({ ...currentTask, status });
        const index = data.findIndex((item) => item.id === changeData.taskChanged.id);
        if (index > -1) {
          data[index] = { ...data[index], status };
          setData([...data]);
          setVisibleData([...data]);
        }
      }
    });
  }, [currentTask, data]);

  useEffect(() => {
    // 添加当前task的log
    socket.off('task_log_added');
    socket.on('task_log_added', (val) => {
      // console.log('task_log_added:', val);
      if (val.taskLogAdded && currentTask && currentTask.id === val.taskLogAdded.taskId) {
        addLog(val.taskLogAdded);
      } else {
        console.error('not val.taskLogAdded');
      }
    });
  }, [currentTask]);

  useEffect(() => {
    // 获取任务列表
    socket.emit('get_tasks_list');

    // 初始化
    socket.on('get_tasks_list', (tasks) => {
      if (Array.isArray(tasks)) {
        tasks.sort(arrSortByKey('name'));
        setData(tasks);
        setVisibleData(tasks);
        const { pathname } = history.location;
        const name = pathname.replace('/tasks/', '');
        const find = tasks.find((item) => item.name === name);
        const current = find || tasks[0];
        setCurrentTask({ ...current });
        socket.emit('get_task_logs', current.id);
      }
    });

    // 切换task的log
    socket.on('get_task_logs', (tid: string, logs: any) => {
      term.clear();
      if (Array.isArray(logs)) {
        logs.forEach((item: any) => {
          if (tid === item.taskId) {
            addLog(item);
          }
        });
        setTimeout(() => {
          fitAddon.fit();
          term.scrollToBottom();
        }, 88);
      }
    });

    return () => {
      socket.off('get_tasks_list');
      socket.off('get_task_logs');
      socket.off('task_log_added');
      socket.off('task_changed');
    };
  }, []);

  const runTask = () => {
    setLoading(true);
    socket.emit('run_tasks', currentTask?.id);
  };

  const stopTask = () => {
    setLoading(true);
    socket.emit('stop_tasks', currentTask?.id);
  };

  const clearLogs = () => {
    term.clear();
    socket.emit('clear_logs', currentTask?.id);
  };

  const onClickTaskItem = (item: any) => {
    const { name, id } = item;
    history.push(`/tasks/${name}`);
    setCurrentTask({ ...item });
    socket.emit('get_task_logs', id);
  };

  const onSearchChange = (e: any) => {
    const { value } = e.target;
    const filter = data.filter((item) => item.name.indexOf(value) > -1);
    setVisibleData(filter);
  };

  const dataGroup = useMemo(() => taskViewGroup<ITaskItem>(visibleData), [visibleData]);

  return (
    <Container isMain title="任务" className="task-container">
      <div className="task-list">
        <div className="search">
          <Input prefix={<SearchOutlined />} allowClear onChange={onSearchChange} placeholder="搜索" />
        </div>
        <div className="task-ul">
          {Object.keys(dataGroup).map((group) => {
            const list = dataGroup[group];
            return (
              <div key={group}>
                <div className="task-group">{group.toUpperCase()}</div>
                {list &&
                  Array.isArray(list) &&
                  list.map((item) => {
                    const { id, name, command, status } = item;
                    return (
                      <div
                        key={id}
                        onClick={() => onClickTaskItem(item)}
                        className={`task-li ${currentTask && currentTask.id === id ? 'active' : ''}`}
                      >
                        <div className="icon">
                          <Tooltip placement="right" title={command} color="blue">
                            {(() => {
                              if (status === 'running') {
                                return <PauseCircleOutlined className="green" />;
                              }
                              if (status === 'error') {
                                return <ExclamationCircleOutlined className="red" />;
                              }
                              if (status === 'done' || status === 'terminated') {
                                return <CheckCircleOutlined className="green" />;
                              }
                              return <CodeOutlined />;
                            })()}
                          </Tooltip>
                        </div>
                        <div className="task-content">
                          <div className="name">{name}</div>
                          <div className="desc">
                            <span className={`color-${status}`}>[{statusMap[status]}]</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="task-scroll">
        <h3>
          <BulbTwoTone /> {currentTask && currentTask.name}
        </h3>
        {currentTask && currentTask.id && (
          <div className="handler">
            {(() => {
              if (currentTask) {
                if (currentTask.status === 'running') {
                  return (
                    <Button type="primary" danger onClick={() => stopTask()} loading={loading} icon={<PauseOutlined />}>
                      停止
                    </Button>
                  );
                }
                return (
                  <Button type="primary" onClick={() => runTask()} loading={loading} icon={<CaretRightOutlined />}>
                    运行
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
        {currentTask && currentTask.id && (
          <div className="terminal">
            <p>
              <CodeOutlined /> 输出：
            </p>
            <Terminal />
          </div>
        )}
      </div>
    </Container>
  );
};
