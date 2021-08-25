import React from 'react';
import { Tabs, Form, Input, Button, Table, Switch, Radio, Row, Col, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default (props: any) => {
  const { formConfig, onFinish, configLoading } = props;

  return (
    <div className="swagger-config">
      <Form name="form_config" form={formConfig} onFinish={onFinish} labelCol={{ span: 10 }}>
        <div className="form-item-title">JSON模拟数据相关：</div>

        <Form.Item name="json_checked" valuePropName="checked" label="生成JSON模拟数据">
          <Switch />
        </Form.Item>

        <div className="form-item-title">MockJS相关：</div>

        <Form.Item name="mock_checked" valuePropName="checked" label="生成MockJS模拟数据">
          <Switch />
        </Form.Item>
        <Form.Item
          name="mock_fileType"
          label="mock文件类型"
          initialValue="js"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="ts">TypeScript</Radio.Button>
            <Radio.Button value="js">JavaScript</Radio.Button>
          </Radio.Group>
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
  );
};
