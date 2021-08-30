import React, { useState } from 'react';
import { Tabs, Menu, Dropdown, Input, Button, Space } from 'antd';
import type { Panes } from '../type';
import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';
import Request from './Request';
import Response from './Response';

const { TabPane } = Tabs;

interface Props {
  pane: Panes;
}

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

const DefaultContent = () => {
  return (
    <div>
      <h2>项目概览的内容</h2>
    </div>
  );
};

export default (props: Props) => {
  const { pane } = props;

  // if (pane.key === '1') {
  //   return <DefaultContent />;
  // }

  return (
    <div className="content">
      <div className="d-header flex-center">
        <div className="radius flex-center">
          <div className="method">
            <Dropdown overlay={menu}>
              <div>
                GET <CaretDownOutlined />
              </div>
            </Dropdown>
          </div>
          <div className="input">
            <Input placeholder='接口路径 "/"或"http"起始 ' />
          </div>
        </div>

        <div className="handler">
          <Space>
            <Button type="primary" icon={<CaretRightOutlined />}>
              运行
            </Button>
            <Button type="default" icon={<SaveOutlined />}>
              保存
            </Button>
          </Space>
        </div>
      </div>

      <h2 className="title">请求参数：</h2>
      <div className="request">
        <Request />
      </div>

      <h2 className="title">响应结果：</h2>
      <div className="response">
        <Response />
      </div>
    </div>
  );
};
