import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default (props: any) => {
  const { onFinish } = props;

  return (
    <Form name="customized_form_controls" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="搜索"
        tooltip={{ title: '首字母是“v”或包含中文表示搜索tag，否则就是搜索path', icon: <InfoCircleOutlined /> }}
      >
        <Input placeholder="可搜索关键字、tag、路径" style={{ width: 230 }} allowClear />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      </Form.Item>
    </Form>
  );
};
