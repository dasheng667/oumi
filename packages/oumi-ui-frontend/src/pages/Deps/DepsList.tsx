import React, { memo, useEffect } from 'react';
import { Tooltip, Space } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  CloudDownloadOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ListItem } from './type.d';
import { useSocket } from '../../hook';

export default memo(
  ({
    list,
    updatePackage,
    removePackage,
    onProgress
  }: {
    list: ListItem[];
    updatePackage: any;
    removePackage: any;
    onProgress: any;
  }) => {
    // const [processing, setProcessing] = useState('');
    const { socket } = useSocket();

    useEffect(() => {
      socket.on('progress_changed', (data) => {
        // console.log('progress_changed', data);
        if (data && data.progressChanged && data.progressChanged.args) {
          const { progress, status, args } = data.progressChanged;
          if (progress === undefined || progress === -1) return;
          const pro = {
            progress,
            status,
            name: args[0]
          };
          onProgress(pro);
        }
      });

      socket.on('progress_removed', (data) => {
        // console.log('progress_removed', data);
        // setProcessing('');
        onProgress({
          progress: -1,
          status: '',
          name: ''
        });
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
        socket.off('progress_changed');
        socket.off('progress_removed');
        socket.off('uninstall_dep_done');
        socket.off('update_dep_done');
      };
    }, []);

    const setDefaultProgress = (data: any) => {
      const pro = {
        ...data,
        progress: 0
      };
      onProgress(pro);
    };

    const installDep = (id: string) => {
      setDefaultProgress({ status: 'dependency-install', name: id });
      socket.emit('install_dep', { id, type: 'devDependencies' });
    };

    const uninstallDep = (id: string) => {
      setDefaultProgress({ status: 'dependency-uninstall', name: id });
      socket.emit('uninstall_dep', { id });
    };

    const updateDep = (id: string) => {
      setDefaultProgress({ status: 'dependency-update', name: id });
      socket.emit('update_dep', { id });
    };

    return (
      <div className="wrapper-deps-list">
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

                        <Tooltip placement="top" title={`移除 ${item.id}`}>
                          <CloseCircleOutlined onClick={() => uninstallDep(item.id)} />
                        </Tooltip>
                      </Space>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
);
