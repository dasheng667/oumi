import React, { useEffect, useState, useMemo } from 'react';
import { Spin, Tabs, Progress } from 'antd';
import Container from '../Container';
import { useSocket, useInterval } from '../../hook';
import type { ListItem } from './type.d';
import DepsList from './DepsList';
import FormAdd from './FormAdd';

import './index.less';

const { TabPane } = Tabs;
const deps: ListItem[] = [];

export default () => {
  const { socket } = useSocket();
  const [delay, setDelay] = useState<number | null>(500);
  const [activeKey, setActiveKey] = useState<'1' | '2'>('2');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ progress: -1, status: '', name: '' });
  const [list, setList] = useState<ListItem[]>([]);

  useInterval(() => {
    setList([...deps]);
  }, delay);

  useEffect(() => {
    setLoading(true);
    socket.emit('get_project_deps');

    socket.on('get_project_deps', (data) => {
      // console.log('on:', data);
      if (!deps.find((item) => item.id === data.data.id)) {
        deps.push(data.data);
      }
    });

    socket.on('get_project_deps_done', () => {
      setDelay(null);
      setLoading(false);
      setList([...deps]);
    });

    return () => {
      socket.off('get_project_deps');
      socket.off('get_project_deps_done');
      setDelay(null);
      deps.length = 0;
    };
  }, []);

  const updatePackage = ({ id, version, versionRange, type }: any) => {
    const find = deps.find((item) => item.id === id);
    if (find) {
      find.current = versionRange || version;
      setList([...deps]);
    }
  };

  const removePackage = ({ id, type }: any) => {
    const index = deps.findIndex((item) => item.id === id);
    if (index > -1) {
      deps.splice(index, 1);
      setList([...deps]);
    }
  };

  const onProgress = (data: any) => {
    setProgress(data);
  };

  const installPackage = (name: string, version?: string) => {
    socket.emit('install_dep', { id: name, type: activeKey === '2' ? 'devDependencies' : '' });
    onProgress({
      progress: 0,
      status: '',
      name
    });
  };

  const list1 = useMemo(() => list.filter((item) => item.type !== 'devDependencies'), [list]);
  const list2 = useMemo(() => list.filter((item) => item.type === 'devDependencies'), [list]);

  return (
    <Container isMain title="项目依赖" className="deps-container">
      {progress.progress !== -1 && (
        <div className="progress">
          <div>
            <Progress type="circle" percent={Math.ceil(progress.progress * 63)} />
            <p className="red">
              {progress.name}: {progress.status}
            </p>
          </div>
        </div>
      )}

      <div className="deps-header mbm10">
        <FormAdd installPackage={installPackage} />
        <div className="info">
          {loading && (
            <span>
              <Spin />
            </span>
          )}{' '}
          依赖 {list && <span>{list.length} 个</span>}
        </div>
      </div>

      <div className="rel">
        <Tabs className="tabs-oumi" activeKey={activeKey} type="card" onChange={(key: any) => setActiveKey(key)}>
          <TabPane tab="运行依赖" key="1" forceRender={false}>
            <DepsList list={list1} updatePackage={updatePackage} removePackage={removePackage} onProgress={onProgress} />
          </TabPane>
          <TabPane tab="开发依赖" key="2" forceRender={false}>
            <DepsList list={list2} updatePackage={updatePackage} removePackage={removePackage} onProgress={onProgress} />
          </TabPane>
        </Tabs>
      </div>
    </Container>
  );
};
