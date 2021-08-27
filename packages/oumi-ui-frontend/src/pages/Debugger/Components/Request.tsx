import React, { useState } from 'react';
import { Tabs, Menu, Dropdown, Input, Button, Space } from 'antd';
import type { Panes } from '../type';
import EditTable from './EditTable';
// import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface Props {}

const menu = (
  <Menu>
    <Menu.Item>
      <span>GET</span>
    </Menu.Item>
    <Menu.Item>
      <span>POST</span>
    </Menu.Item>
  </Menu>
);

export default (props: Props) => {
  const { pane } = props;

  function callback(key) {
    console.log(key);
  }

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Params" key="1">
        <EditTable />
      </TabPane>
      <TabPane tab="Body" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Header" key="3">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="Cookie" key="4">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  );
};
