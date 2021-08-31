import React, { memo, useState, useEffect } from 'react';
import { Tabs, Menu, Dropdown, Input, Button, Space } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '../../../hook';
import Request from './Request';
import Response from './Response';
import type { Panes, Env } from '../type';

const { TabPane } = Tabs;

interface Props {
  pane: Panes;
  env: Env;
  onSaveSuccess?: (data: any) => void;
}

const RenderMenu = ({ onClick }: any) => (
  <Menu>
    <Menu.Item key="get" onClick={() => onClick('get')}>
      <span>GET</span>
    </Menu.Item>
    <Menu.Item key="post" onClick={() => onClick('post')}>
      <span>POST</span>
    </Menu.Item>
  </Menu>
);

const DefaultContent = () => {
  return (
    <div>
      <h2>项目概览的内容。</h2>
      <p>接口调速器！</p>
    </div>
  );
};

export default memo((props: Props) => {
  const { pane, env, onSaveSuccess } = props;
  // console.log('pane', pane);
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'get' | 'post'>('get');
  const [requestData, setRequestData] = useState<any>({
    query: [],
    bodyFormData: [],
    header: [],
    cookie: []
  });

  const { request: requestDetail } = useRequest('/api/debugger/taskDetail', { lazy: true });
  const {
    request: requestRun,
    loading: loadingRun,
    data: responseData
  } = useRequest('/api/debugger/runTask', { lazy: true });
  const { request: requestSave, loading: loadingSave } = useRequest('/api/debugger/save', { lazy: true });

  const onSetRequestData = (data: any) => {
    setRequestData({ ...requestData, ...data });
    console.log('requestData:', requestData);
  };

  const onRun = () => {
    requestRun({
      method,
      url,
      env,
      request: requestData
    });
  };

  const onSave = async () => {
    const res: any = await requestSave({
      key: pane.key,
      method,
      url,
      env,
      request: requestData
    });
    if (typeof onSaveSuccess === 'function') {
      onSaveSuccess({
        pane: { ...pane, isDelete: pane.title === '新建接口', prevKey: pane.key, ...res }
      });
    }
  };

  const onInputChange = (e: any) => {
    const { value } = e.target;
    setUrl(value);
  };

  useEffect(() => {
    if (pane && pane.key && pane.key !== '1') {
      requestDetail({ key: pane.key }).then((res: any) => {
        if (!res) return;
        if (res.url) {
          setUrl(res.url);
        }
        if (res.method) {
          setMethod(res.method);
        }
        if (res.request) {
          setRequestData(res.request);
        }
      });
    }
  }, [pane]);

  if (pane.key === '1') {
    return <DefaultContent />;
  }

  return (
    <div className="content-body">
      <div className="d-header flex-center">
        <div className="radius flex-center">
          <div className="method">
            <Dropdown overlay={<RenderMenu onClick={setMethod} />} trigger={['click']}>
              <div>
                {method.toLocaleUpperCase()} <CaretDownOutlined />
              </div>
            </Dropdown>
          </div>
          <div className="input">
            <Input placeholder='接口路径 "/"或"http"起始 ' onChange={onInputChange} defaultValue={pane.url} />
          </div>
        </div>

        <div className="handler">
          <Space>
            <Button type="primary" icon={<CaretRightOutlined />} onClick={onRun} loading={loadingRun}>
              运行
            </Button>
            <Button type="default" icon={<SaveOutlined />} onClick={onSave} loading={loadingSave}>
              保存
            </Button>
          </Space>
        </div>
      </div>

      <h2 className="title">请求参数：</h2>
      <div className="request">
        <Request requestData={requestData} setRequestData={onSetRequestData} />
      </div>

      <h2 className="title">响应结果：</h2>
      <div className="response">
        <Response responseData={responseData} />
      </div>
    </div>
  );
});
