import React, { useEffect, useState } from 'react';
import { Button, message, Form, Input, Popconfirm } from 'antd';
import { useRequest } from '../../../hook';

type Props = {
  /** null 表示当前项目 */
  selectNode: any | null;
  onSuccess: () => void;
};

export default (props: Props) => {
  const { selectNode, onSuccess } = props;
  const { dirPath } = selectNode || {};
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const { data, request, loading } = useRequest('/api/project/createDir', { lazy: true });

  const showPopconfirm = (flag: boolean) => {
    setVisible(flag);
  };

  const onOk = () => {
    form.validateFields().then((val) => {
      request({
        currentPath: dirPath,
        ...val
      }).then((res) => {
        setVisible(false);
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      });
    });
  };

  const content = () => {
    return (
      <div>
        <Form form={form} className="my-popconfirm-form">
          <Form.Item
            name="dirName"
            label="目录名称"
            rules={[
              {
                required: true,
                message: '请输入目录名称'
              },
              {
                pattern: /^[a-zA-Z0-9_-]+$/,
                message: '请输入正确的目录名称'
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
      visible={visible}
      onConfirm={onOk}
      placement="top"
      okButtonProps={{ loading }}
      onCancel={() => showPopconfirm(false)}
      icon={false}
    >
      <Button size="middle" disabled={!selectNode} onClick={() => showPopconfirm(true)}>
        新建文件夹
      </Button>
    </Popconfirm>
  );
};
