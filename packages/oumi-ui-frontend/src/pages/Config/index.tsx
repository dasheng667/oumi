import React from 'react';
import { Tabs, Form, Input, Button, Table, Spin } from 'antd';
import { useRequest } from '../../hook';

import './index.less';

const { TabPane } = Tabs;

export default () => {
  const [form] = Form.useForm();
  const { data, request: requestConfig } = useRequest<{ swagger: any }>('/api/config/get');
  const { request: requestSwaggerAdd, loading: loadingAdd } = useRequest('/api/config/swagger/add', { lazy: true });
  const { request: requestSwaggerRemove } = useRequest('/api/config/swagger/remove', { lazy: true });

  const dataSource = data && data.swagger ? data.swagger : [];

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (value: any) => {
    // console.log('value', value)
    requestSwaggerAdd(value).then((res) => {
      onReset();
      requestConfig();
    });
  };

  const checkHref = (_: any, value: string) => {
    const reg = new RegExp(/^[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_%&\\?\\/.:=]+$/);
    if (value && reg.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入一个正确的链接'));
  };

  const removeSwagger = (item: any) => {
    requestSwaggerRemove({ id: item.id }).then((res) => {
      requestConfig();
    });
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '链接',
      dataIndex: 'href',
      key: 'href'
    },
    {
      title: '操作',
      render: (text: string, item: any) => {
        return (
          <a onClick={() => removeSwagger(item)} key={item.id}>
            删除
          </a>
        );
      }
    }
  ];

  return (
    <div className="ui-config-content">
      <div className="top-header">
        <h2>配置</h2>
      </div>

      <div className="ui-config-container">
        <Tabs type="card">
          <TabPane tab="Swagger 配置" key="1">
            <Form name="customized_form_controls" form={form} layout="inline" onFinish={onFinish}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入Swagger名称' }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="href"
                label="链接"
                rules={[{ required: true, validator: checkHref, message: '请输入一个正确的链接' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingAdd}>
                  新增
                </Button>
              </Form.Item>
            </Form>

            <div style={{ width: 700, marginTop: 50 }}>
              <Table
                rowKey="id"
                title={() => '我的 Swagger'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
            </div>
          </TabPane>
          <TabPane tab="配置 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="配置 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
