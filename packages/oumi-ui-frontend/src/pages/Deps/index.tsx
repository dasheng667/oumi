import React, { memo, useEffect, useState } from 'react';
import { Spin, Tabs, Tooltip, Space, message } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  CloudDownloadOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import Container from '../Container';
import { useSocket, useInterval } from '../../hook';

import './index.less';

const { TabPane } = Tabs;

interface ListItem {
  aseFir: string;
  current: string;
  id: string;
  installed: boolean;
  avatars: string;
  latest: string;
  type: string;
  versionRange: string;
  website: string;
}

const deps: ListItem[] = [];
const depsDev: ListItem[] = [];

export default () => {
  const { socket } = useSocket();
  const [delay, setDelay] = useState<number | null>(500);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ListItem[]>([]);
  const [listDev, setListDev] = useState<ListItem[]>([]);

  useInterval(() => {
    setList([...deps]);
    setListDev([...depsDev]);
  }, delay);

  useEffect(() => {
    setLoading(true);
    socket.emit('get_project_deps');

    socket.on('get_project_deps', (data) => {
      console.log('on:', data);
      if (data.data.type === 'devDependencies') {
        depsDev.push(data.data);
      } else {
        deps.push(data.data);
      }
    });

    socket.on('get_project_deps_done', () => {
      setDelay(null);
      setLoading(false);
      setList([...deps]);
      setListDev([...depsDev]);
    });

    return () => {
      socket.off('get_project_deps');
      socket.off('get_project_deps_done');
      setDelay(null);
      deps.length = 0;
      depsDev.length = 0;
    };
  }, []);

  const updatePackage = ({ id, version, versionRange, type }: any) => {
    if (type === 'dev' || type === 'devDependencies') {
      const find = depsDev.find((item) => item.id === id);
      if (find) {
        find.current = versionRange || version;
        setListDev([...depsDev]);
      }
    } else {
      const find = deps.find((item) => item.id === id);
      if (find) {
        find.current = versionRange || version;
        setList([...deps]);
      }
    }
  };

  const removePackage = ({ id, type }: any) => {
    if (type === 'dev' || type === 'devDependencies') {
      const index = depsDev.findIndex((item) => item.id === id);
      if (index > -1) {
        depsDev.splice(index, 1);
        setListDev([...depsDev]);
      }
    } else {
      const index = deps.findIndex((item) => item.id === id);
      if (index > -1) {
        deps.splice(index, 1);
        setList([...deps]);
      }
    }
  };

  return (
    <Container title="项目依赖" className="deps-container">
      <div className="deps-header mbm10">
        {loading && (
          <span>
            <Spin />
          </span>
        )}{' '}
        依赖 {list && <span>{list.length + listDev.length} 个</span>}
      </div>

      <Tabs className="tabs-oumi" defaultActiveKey="2" type="card">
        <TabPane tab="运行依赖" key="1" forceRender={false}>
          <RenderDepsList list={list} updatePackage={updatePackage} removePackage={removePackage} />
        </TabPane>
        <TabPane tab="开发依赖" key="2" forceRender={false}>
          <RenderDepsList list={listDev} updatePackage={updatePackage} removePackage={removePackage} />
        </TabPane>
      </Tabs>

      <div className="deps-list"></div>
    </Container>
  );
};

const RenderDepsList = memo(({ list, updatePackage, removePackage }: any) => {
  const [processing, setProcessing] = useState('');
  const { socket } = useSocket();

  useEffect(() => {
    socket.on('progress_changed', (data) => {
      // console.log('progress_changed', data);
    });

    socket.on('progress_removed', (data) => {
      // console.log('progress_removed', data);
      setProcessing('');
    });

    socket.on('uninstall_dep_done', (data) => {
      // console.log('uninstall_dep_done', data);
      removePackage(data);
    });

    socket.on('update_dep_done', (data) => {
      // console.log('update_dep_done', data);
      updatePackage(data);
    });

    return () => {
      socket.off('uninstall_dep_done');
      socket.off('update_dep_done');
      socket.off('progress_changed');
      socket.off('progress_removed');
    };
  }, []);

  const installDep = (id: string) => {
    if (processing) {
      message.error(`${processing} 正在处理中...`);
      return;
    }
    setProcessing(id);
    socket.emit('install_dep', { id, type: 'devDependencies' });
  };

  const uninstallDep = (id: string) => {
    if (processing) {
      message.error(`${processing} 正在处理中...`);
      return;
    }
    setProcessing(id);
    socket.emit('uninstall_dep', { id });
  };

  const updateDep = (id: string) => {
    if (processing) {
      message.error(`${processing} 正在处理中...`);
      return;
    }
    setProcessing(id);
    socket.emit('update_dep', { id });
  };

  return (
    <div className="deps-list">
      <ul>
        {list &&
          list.map((item) => {
            return (
              <li key={item.id}>
                <div className="deps-logo">
                  <img src={item.avatars} alt="" />
                </div>
                <div className="deps-content">
                  <div className="name">{item.id}</div>
                  <div className="description">
                    <span>
                      当前 <small>{item.current}</small>
                    </span>
                    <span>
                      最新 <small>{item.latest}</small>
                    </span>
                    <span>
                      <span>
                        {item.installed && (
                          <>
                            <CheckCircleOutlined /> 已安装
                          </>
                        )}
                        {!item.installed && (
                          <>
                            <InfoCircleOutlined /> 未安装
                          </>
                        )}
                      </span>
                      <a href={item.website} target="_blank" className="link">
                        查看详情
                      </a>
                    </span>
                  </div>
                </div>
                <div className="deps-button">
                  <Space>
                    {(() => {
                      if (processing === item.id) {
                        return <LoadingOutlined />;
                      }
                      if (!item.installed) {
                        return (
                          <Tooltip placement="top" title={`安装 ${item.id}`}>
                            <CloudDownloadOutlined onClick={() => installDep(item.id)} />
                          </Tooltip>
                        );
                      }
                      // eslint-disable-next-line eqeqeq
                      if (item.current != item.latest) {
                        return (
                          <Tooltip placement="top" title={`更新 ${item.id}`}>
                            <SyncOutlined onClick={() => updateDep(item.id)} />
                          </Tooltip>
                        );
                      }
                      return null;
                    })()}

                    {(() => {
                      if (processing !== item.id) {
                        return (
                          <Tooltip placement="top" title={`移除 ${item.id}`}>
                            <CloseCircleOutlined onClick={() => uninstallDep(item.id)} />
                          </Tooltip>
                        );
                      }
                      return null;
                    })()}
                  </Space>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
});
