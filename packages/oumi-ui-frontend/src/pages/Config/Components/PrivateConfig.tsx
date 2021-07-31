import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from '../../../hook';

export default ({ data }: { data: any }) => {
  const [form] = Form.useForm();
  const [token, setToken] = useState('');
  const { loading, request } = useRequest('/api/config/savePrivateConfig', { lazy: true });

  useEffect(() => {
    if (data && data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const onFinish = (val: any) => {
    request(val).then((res) => {
      message.success('保存完成');
      setToken(val.access_token);
    });
  };

  return (
    <div className="swagger-config" style={{ width: 550 }}>
      <Form name="form_config" form={form} onFinish={onFinish} labelCol={{ span: 10 }}>
        <div className="info" style={{ padding: '5px 0 10px 25px' }}>
          <p style={{ color: '#ff0000' }}>声明：该项目所有配置都是本地存储，不会上传任何数据！</p>
          <p>
            因github的下载文件api有次数限制，可配置access_token无限制下载。 <br />
            <a href="https://api.github.com/users/octocat" target="_blank">
              【查询是否限制】
            </a>{' '}
            &nbsp;&nbsp;&nbsp;
            <a
              href={`https://api.github.com/rate_limit?access_token=${token || (data && data.access_token) || ''}`}
              target="_blank"
            >
              【查看我的次数】
            </a>{' '}
            &nbsp;&nbsp;&nbsp;
            <a href="https://www.yuque.com/qqhh/cuq2ci/hzv2kt" target="_blank">
              【如何配置token】
            </a>
          </p>
        </div>

        <Form.Item
          name="access_token"
          label="github 的 access_token"
          rules={[{ required: true, message: '请输入' }]}
          // tooltip={{ title: '所有配置都是存储在用户本地，该项目不会上传任何数据！', icon: <InfoCircleOutlined /> }}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ paddingLeft: 208 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
