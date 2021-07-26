import React, { useEffect } from 'react';
import { Tabs, Form, Input, Button, Table, Switch, Radio, Row, Col, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from '../../hook';

import './index.less';

const { TabPane } = Tabs;

export default () => {
  const [formAdd] = Form.useForm();
  const [formConfig] = Form.useForm();
  const { data, request: requestConfig } = useRequest<{ swagger: any[]; swaggerConfig: any }>('/api/config/get');
  const { request: requestSwaggerAdd, loading: loadingAdd } = useRequest('/api/config/swagger/add', { lazy: true });
  const { request: requestSwaggerRemove } = useRequest('/api/config/swagger/remove', { lazy: true });
  const { request: requestSaveSwaggerConfig, loading: configLoading } = useRequest('/api/swagger/saveConfig', {
    lazy: true
  });

  const dataSource = data && data.swagger ? data.swagger : [];

  useEffect(() => {
    if (data && data.swaggerConfig) {
      formConfig.setFieldsValue(data.swaggerConfig);
    }
  }, [data]);

  const onReset = () => {
    formAdd.resetFields();
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

  const onFinishConfig = (val: any) => {
    console.log('onFinishConfig:', val);
    requestSaveSwaggerConfig(val).then((res) => {
      message.success('保存成功');
    });
  };

  return (
    <div className="ui-config-content">
      <div className="top-header">
        <h2>配置</h2>
      </div>

      <div className="ui-config-container ui-content-container">
        <Tabs type="card">
          <TabPane tab="Swagger" key="1">
            <Row>
              <Col span={12}>
                <h3>Swagger配置</h3>

                <div className="swagger-config">
                  <Form name="form_config" form={formConfig} onFinish={onFinishConfig} labelCol={{ span: 10 }}>
                    <div className="form-item-title">JSON模拟数据相关：</div>

                    <Form.Item name="json_checked" valuePropName="checked" label="生成JSON模拟数据">
                      <Switch />
                    </Form.Item>

                    <div className="form-item-title">MockJS相关：</div>

                    <Form.Item name="mock_checked" valuePropName="checked" label="生成MockJS模拟数据">
                      <Switch />
                    </Form.Item>

                    <div className="form-item-title">API相关：</div>

                    <Form.Item
                      name="requestLibPath"
                      label="requestLibPath"
                      rules={[{ required: true, message: '请输入' }]}
                      tooltip={{ title: 'request的导入请求头', icon: <InfoCircleOutlined /> }}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item name="api_fileType" label="生成文件类型" rules={[{ required: true, message: '请选择' }]}>
                      <Radio.Group buttonStyle="solid">
                        <Radio.Button value="ts">TypeScript</Radio.Button>
                        <Radio.Button value="js">JavaScript</Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="outputFileType"
                      label="多文件"
                      rules={[{ required: true, message: '请选择' }]}
                      tooltip={{ title: '导出的多个api是否合并成一个文件', icon: <InfoCircleOutlined /> }}
                    >
                      <Radio.Group buttonStyle="solid">
                        <Radio.Button value="merge">合并</Radio.Button>
                        <Radio.Button value="none">不合并</Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) =>
                        getFieldValue('outputFileType') === 'merge' ? (
                          <Form.Item
                            name="outputFileName"
                            label="导出文件名称"
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue="serve.ts"
                            shouldUpdate
                          >
                            <Input />
                          </Form.Item>
                        ) : null
                      }
                    </Form.Item>

                    <Form.Item
                      name="filterPathPrefix"
                      label="需要过滤的api前缀"
                      tooltip={{ title: '此配置/crm/api/getList可过滤为 /getList', icon: <InfoCircleOutlined /> }}
                    >
                      <Input placeholder="例如：api" />
                    </Form.Item>

                    <Form.Item style={{ paddingLeft: 208 }}>
                      <Button type="primary" htmlType="submit" loading={configLoading}>
                        保存
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
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
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                  />
                </div>
              </Col>
            </Row>
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
