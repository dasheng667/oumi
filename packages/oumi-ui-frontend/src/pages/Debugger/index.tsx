import React, { useState, useEffect } from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Tabs, Button, Select, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { useRequest } from '@src/hook';

import Slider from './Components/Slider';
import Content from './Components/Content';
import GlobalEnv from './Components/GlobalEnv';
import { updateTreeData, loop } from '@src/utils';
import { listToTreeList } from './utils';

import type { Panes, Env, TreeNode } from './type';

import './less/index.less';
import './less/slider.less';
import './less/content.less';
import './less/env.less';
import './less/request.less';

const { TabPane } = Tabs;
const { Option } = Select;
const defpanes = [{ title: '项目概览', content: 'Content of Tab Pane 1', key: '1' }];

export default () => {
  const history = useHistory();
  const [panes, setPanes] = useState<Panes[]>([...defpanes]);
  // const [env, setEnv] = useState<Env>('dev');
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(defpanes[0].key);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const { request: requestGetEnv, data: env, setData: setEnv } = useRequest<Env>('/api/debugger/getCurrentEnv');
  const { request: requestToggleEnv } = useRequest('/api/debugger/toggleEnv', { lazy: true });
  const { data: dataList, request: requestList } = useRequest<any[]>('/api/debugger/getList');
  const { request: requestRemove, loading: removeLoading } = useRequest('/api/debugger/remove', { lazy: true });

  useEffect(() => {
    setTreeData(listToTreeList(dataList));
  }, [dataList]);

  useEffect(() => {
    const { hash } = window.location;
    if (hash && dataList) {
      const key = hash.substr(1);
      loop(dataList, key, (val) => {
        addPane(val);
      });
    }
  }, [dataList, history, history.location]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    // console.log('action', action);
    if (action === 'remove' && typeof e === 'string') {
      removePane(e);
    }
  };

  const pushHash = (data: any) => {
    if (data.title !== '新建接口') {
      window.location.hash = `${data.key}`;
    }
  };

  const addPane = (data: any) => {
    const last = panes[panes.length - 1];
    if (last.isNew) {
      if (data.title === last.title) {
        setActiveKey(last.key);
        return;
      }
    }

    if (!data.key) {
      // eslint-disable-next-line no-param-reassign
      data.key = `newTab${panes.length++}`;
    }
    const find = panes.find((item) => item && item.key === data.key);
    if (find) {
      setActiveKey(find.key);
    } else {
      const p = { ...data };
      setPanes([...panes, p].filter((v) => v && v.key));
      setActiveKey(p.key);
    }

    pushHash(data);
  };

  const removePane = (targetKey: any) => {
    let lastIndex: any = '';
    let key = activeKey;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes2 = panes.filter((pane) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        key = panes[lastIndex].key;
      } else {
        key = panes[0].key;
      }
    }
    setPanes([...panes2]);
    setActiveKey(key);
  };

  const handleChange = (value: Env) => {
    setEnv(value);
    requestToggleEnv({ env: value });
  };

  const Operations = () => {
    return (
      <Space className="operations prp10">
        <Select value={env} style={{ width: 120 }} onChange={handleChange}>
          <Option value="dev">开发环境</Option>
          <Option value="test">测试环境</Option>
          <Option value="prod">生产环境</Option>
        </Select>
        <span className="icon" onClick={() => setVisible(true)}>
          <UnorderedListOutlined />
        </span>
      </Space>
    );
  };

  const onSaveSuccess = ({ pane }: any) => {
    requestList();
    // console.log('pane', pane)
    if (pane && pane.isNew) {
      const i = panes.findIndex((p) => p.key === pane.prevKey);
      if (i > -1) {
        // eslint-disable-next-line no-param-reassign
        delete pane.isNew;
        panes.splice(i, 1, pane);
      }
      setPanes([...panes]);
      setActiveKey(pane.key);
      pushHash(pane);
    }
  };

  const removePaneItem = async (key: string) => {
    if (key && !removeLoading) {
      await requestRemove({ key });
      requestList();
      const findIndex = panes.findIndex((item) => item.key === key);
      if (findIndex > -1) {
        setPanes(panes.filter((v) => v.key !== key));
        if (activeKey === key) {
          setActiveKey('1');
        }
      }
    }
  };

  const addChildTree = (key: string, children: TreeNode[]) => {
    setTreeData((origin) => updateTreeData<TreeNode[]>(origin, key, children));
    setExpandedKeys([...expandedKeys, key]);
  };

  const onTreeExpand = (keys: string[], { expanded, node }: any) => {
    console.log('xx', keys, expanded, node);
    // const { key } = node;
    // if (expanded) {
    //   setExpandedKeys([...expandedKeys, key]);
    // } else {
    //   setExpandedKeys(expandedKeys.filter((k) => k !== key));
    // }
  };

  return (
    <div className="container-debugger">
      <Slider
        addPane={addPane}
        expandedKeys={expandedKeys}
        list={treeData}
        removeItem={removePaneItem}
        removeLoading={removeLoading}
        onExpand={onTreeExpand}
      />
      <div className="container-content">
        <Tabs
          className="custom-tabs"
          hideAdd
          onChange={onChange}
          onEdit={onEdit}
          activeKey={activeKey}
          type="editable-card"
          tabBarExtraContent={<Operations />}
        >
          {panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key}>
              <div className="tab-content">
                <Content pane={pane} env={env} onSaveSuccess={onSaveSuccess} addChildTree={addChildTree} />
              </div>
            </TabPane>
          ))}
        </Tabs>
        {/* <Container /> */}
      </div>
      <GlobalEnv visible={visible} setVisible={setVisible} />
    </div>
  );
};
