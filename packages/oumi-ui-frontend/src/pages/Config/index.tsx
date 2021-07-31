import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, Button, Table, Switch, Radio, Row, Col, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useRequest, useLocation } from '../../hook';
import type { ListItem } from '../../global';
import SwaggerConfig from './Components/SwaggerConfig';
import PrivateConfig from './Components/PrivateConfig';

import './index.less';

const { TabPane } = Tabs;

type IConfigData = {
  swagger: ListItem[];
  swaggerConfig: any;
  blocks: ListItem[];
  private: any;
};

export default () => {
  const [formAdd] = Form.useForm();
  const [formBlock] = Form.useForm();
  const [formConfig] = Form.useForm();

  const { query } = useLocation();
  const [currentTag, setCurrentTag] = useState('1');

  const { data, request: requestConfig } = useRequest<IConfigData>('/api/config/get');

  const { request: requestSwaggerAdd, loading: loadingAdd } = useRequest('/api/config/swagger/add', { lazy: true });

  const { request: requestSwaggerRemove } = useRequest('/api/config/swagger/remove', { lazy: true });

  const { request: requestSaveSwaggerConfig, loading: configLoading } = useRequest('/api/swagger/saveConfig', {
    lazy: true
  });

  const { request: requestSaveBlock, loading: loadingAddBlock } = useRequest('/api/block/pushItem', { lazy: true });
  const { request: requestRemoveBlock } = useRequest('/api/block/removeItem', { lazy: true });

  useEffect(() => {
    if (query && query.key) {
      setCurrentTag(query.key);
    }
  }, []);

  useEffect(() => {
    if (data && data.swaggerConfig) {
      formConfig.setFieldsValue(data.swaggerConfig);
    }
  }, [data]);

  const onFinish = (value: any) => {
    // console.log('value', value)
    requestSwaggerAdd(value).then((res) => {
      formAdd.resetFields();
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

  const removeSwagger = (item: ListItem) => {
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
      render: (text: string, item: ListItem) => {
        return (
          <a onClick={() => removeSwagger(item)} key={item.id}>
            删除
          </a>
        );
      }
    }
  ];

  const onFinishConfig = (val: any) => {
    // console.log('onFinishConfig:', val);
    requestSaveSwaggerConfig(val).then((res) => {
      message.success('保存成功');
    });
  };

  const removeBlock = (item: ListItem) => {
    requestRemoveBlock({ id: item.id }).then((res) => {
      requestConfig();
    });
  };

  const columnsBlock = [
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
      title: '默认',
      dataIndex: 'default',
      key: 'default',
      render: (text: string, item: ListItem) => {
        return String(text) === '1' ? <span key={item.id}>是</span> : <span key={item.id}>否</span>;
      }
    },
    {
      title: '操作',
      render: (text: string, item: ListItem) => {
        if (item.default) return <span key={item.id}>无</span>;
        return (
          <a onClick={() => removeBlock(item)} key={item.id}>
            删除
          </a>
        );
      }
    }
  ];

  const onFinishBlock = (val: any) => {
    // console.log('onFinishBlock:', val);
    requestSaveBlock(val).then((res) => {
      message.success('保存成功');
      formBlock.resetFields();
      requestConfig();
    });
  };

  return (
    <div className="ui-config-content">
      <div className="top-header">
        <h2>配置</h2>
      </div>

      <div className="ui-config-container ui-content-container">
        <Tabs type="card" activeKey={currentTag} onChange={(key) => setCurrentTag(key)}>
          <TabPane tab="Swagger" key="1">
            <Row>
              <Col span={12}>
                <h3>Swagger配置</h3>
                <SwaggerConfig formConfig={formConfig} onFinish={onFinishConfig} configLoading={configLoading} />
              </Col>

              <Col span={12}>
                <h3>Swagger列表</h3>
                <Form name="form_add" form={formAdd} layout="inline" onFinish={onFinish}>
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
                    dataSource={data && data.swagger ? data.swagger : []}
                    columns={columns}
                    pagination={false}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="资产配置" key="2">
            <h3>资产列表</h3>
            <p></p>
            <Form name="form_block" form={formBlock} layout="inline" onFinish={onFinishBlock}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入资产名称' }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="href"
                label="Github资产路径"
                rules={[{ required: true, message: '请输入一个正确的资产路径' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingAddBlock}>
                  新增
                </Button>
              </Form.Item>
            </Form>

            <div style={{ width: 800, marginTop: 50 }}>
              <Table
                rowKey="id"
                title={() => '资产列表'}
                bordered
                dataSource={data && data.blocks ? data.blocks : []}
                columns={columnsBlock}
                pagination={false}
              />
            </div>
          </TabPane>

          <TabPane tab="私有配置" key="3">
            <PrivateConfig data={data && data.private} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
