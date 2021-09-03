import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Popconfirm } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import { useRequest, useEventListener } from '../../../hook';

type Props = {
  onAddCase: (val: { name: string }) => void;
};

export default (props: Props) => {
  const { onAddCase } = props;
  const [form] = Form.useForm();
  // const [visible, setVisible] = React.useState(false);
  const { data, request, loading } = useRequest('/api/project/xxx', { lazy: true });

  const showPopconfirm = (flag: boolean, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onOk = () => {
    form.validateFields().then((val) => {
      onAddCase(val);
    });
  };

  const content = () => {
    return (
      <div>
        <Form form={form} className="my-popconfirm-form">
          <Form.Item
            name="name"
            label="用例名称"
            rules={[
              {
                required: true,
                message: '请输入用例名称'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <Popconfirm
      title={content}
      onConfirm={onOk}
      placement="bottom"
      // okButtonProps={{ loading }}
      onCancel={(e) => showPopconfirm(false, e)}
      icon={false}
    >
      <Button type="primary" danger icon={<BugOutlined />}>
        另存为用例
      </Button>
    </Popconfirm>
  );
};
