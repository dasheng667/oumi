import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, Button, Table, Space, Row, Col, message } from 'antd';
import { useRequest, useLocation } from '@src/hook';
import type { ListItem } from '@src/global';
import SwaggerConfig from './Components/SwaggerConfig';
import PrivateConfig from './Components/PrivateConfig';
import Container from '../Container';

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
    return Promise.reject(new Error('??????????????????????????????'));
  };

  const removeSwagger = (item: ListItem) => {
    requestSwaggerRemove({ id: item.id }).then((res) => {
      requestConfig();
    });
  };

  const columns = [
    {
      title: '??????',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '??????',
      dataIndex: 'href',
      key: 'href',
      width: 200
    },
    {
      title: '??????',
      width: 70,
      render: (text: string, item: ListItem) => {
        if (item.default) return null;
        return (
          <a onClick={() => removeSwagger(item)} key={item.id}>
            ??????
          </a>
        );
      }
    }
  ];

  const onFinishConfig = (val: any) => {
    // console.log('onFinishConfig:', val);
    requestSaveSwaggerConfig(val).then((res) => {
      message.success('????????????');
    });
  };

  const removeBlock = (item: ListItem) => {
    requestRemoveBlock({ id: item.id }).then((res) => {
      requestConfig();
    });
  };

  const columnsBlock = [
    {
      title: '??????',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '??????',
      dataIndex: 'href',
      key: 'href'
    },
    {
      title: '??????',
      dataIndex: 'default',
      key: 'default',
      render: (text: string, item: ListItem) => {
        return String(text) === '1' ? <span key={item.id}>???</span> : <span key={item.id}>???</span>;
      }
    },
    {
      title: '??????',
      render: (text: string, item: ListItem) => {
        if (item.default) return <span key={item.id}>???</span>;
        return (
          <a onClick={() => removeBlock(item)} key={item.id}>
            ??????
          </a>
        );
      }
    }
  ];

  const onFinishBlock = (val: any) => {
    // console.log('onFinishBlock:', val);
    requestSaveBlock(val).then((res) => {
      message.success('????????????');
      formBlock.resetFields();
      requestConfig();
    });
  };

  return (
    <Container title="??????" className="ui-config-content">
      <div className="ui-config-container ui-content-container">
        <Tabs className="tabs-oumi" type="card" activeKey={currentTag} onChange={(key) => setCurrentTag(key)}>
          <TabPane tab="Swagger" key="1">
            <Row>
              <Col span={11}>
                <h3>Swagger??????</h3>
                <SwaggerConfig formConfig={formConfig} onFinish={onFinishConfig} configLoading={configLoading} />
              </Col>

              <Col span={13}>
                <h3>Swagger??????</h3>
                <Form name="form_add" form={formAdd} layout="inline" onFinish={onFinish}>
                  <Form.Item name="name" label="??????" rules={[{ required: true, message: '?????????Swagger??????' }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="href"
                    label="??????"
                    rules={[{ required: true, validator: checkHref, message: '??????????????????????????????' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingAdd}>
                      ??????
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ width: 700, marginTop: 50 }}>
                  <Table
                    rowKey="id"
                    title={() => '?????? Swagger'}
                    bordered
                    dataSource={data && data.swagger ? data.swagger : []}
                    columns={columns}
                    pagination={false}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="????????????" key="2">
            <h3>????????????</h3>
            <Form name="form_block" form={formBlock} layout="inline" onFinish={onFinishBlock}>
              <Form.Item name="name" label="??????" rules={[{ required: true, message: '?????????????????????' }]}>
                <Input />
              </Form.Item>

              <Form.Item name="href" label="????????????" rules={[{ required: true, message: '????????????????????????????????????' }]}>
                <Input />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loadingAddBlock}>
                    ??????
                  </Button>
                  <a href="https://www.yuque.com/qqhh/cuq2ci/vpg4rw" target="_blank">
                    ???????????????
                  </a>
                </Space>
              </Form.Item>
            </Form>

            <div style={{ width: 800, marginTop: 50 }}>
              <Table
                rowKey="id"
                title={() => '????????????'}
                bordered
                dataSource={data && data.blocks ? data.blocks : []}
                columns={columnsBlock}
                pagination={false}
              />
            </div>
          </TabPane>

          <TabPane tab="????????????" key="3">
            <PrivateConfig data={data && data.private} />
          </TabPane>
        </Tabs>
      </div>
    </Container>
  );
};
