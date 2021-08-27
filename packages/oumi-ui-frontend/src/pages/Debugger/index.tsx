import React, { useState } from 'react';
import { Tabs } from 'antd';

import Slider from './Components/Slider';
import Content from './Components/Content';
import type { Panes } from './type';

import './less/index.less';
import './less/slider.less';
import './less/content.less';

const { TabPane } = Tabs;

const defpanes = [{ title: '项目概览', content: 'Content of Tab Pane 1', key: '1' }];

export default () => {
  const [panes, setPanes] = useState<Panes[]>([...defpanes]);
  const [activeKey, setActiveKey] = useState(defpanes[0].key);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    // console.log('action', action);
    if (action === 'remove' && typeof e === 'string') {
      removePane(e);
    }
  };

  const addPane = () => {
    const last = panes[panes.length - 1];
    if (last.title === '新建接口') return;

    const key = `newTab${panes.length++}`;
    const p = { title: '新建接口', content: '', key };
    setPanes([...panes, p].filter((v) => v && v.key));
    setActiveKey(key);
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

  return (
    <div className="container-debugger">
      <Slider addPane={addPane} />
      <div className="container-content">
        <Tabs
          className="tabs-oumi"
          hideAdd
          onChange={onChange}
          onEdit={onEdit}
          activeKey={activeKey}
          type="editable-card"
        >
          {panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key}>
              <div className="content">
                <Content pane={pane} />
              </div>
            </TabPane>
          ))}
        </Tabs>
        {/* <Container /> */}
      </div>
    </div>
  );
};
