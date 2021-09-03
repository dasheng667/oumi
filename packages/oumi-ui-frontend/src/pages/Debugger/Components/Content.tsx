import React, { memo, useState, useEffect } from 'react';
import { Tabs, Menu, Dropdown, Input, Button, Space, Tooltip, Spin } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  SaveOutlined,
  BugOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useRequest } from '@src/hook';
import Request from './Request';
import Response from './Response';
import TestCaseButton from './TestCaseButton';
import { DegContext } from '../context';

import type { Panes, Env, IRequestData, TreeNode, IRequestPostItem } from '../type';

// const { TabPane } = Tabs;

interface Props {
  pane: Panes;
  env: Env;
  onSaveSuccess?: (data: any) => void;
  addChildTree: (key: string, children: TreeNode[]) => void;
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
  const { pane, env, onSaveSuccess, addChildTree } = props;
  // console.log('pane', pane);
  const { isTest: isTestExample, isNew } = pane;
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'get' | 'post'>('get');
  const [requestPostData, setRequestPostData] = useState<IRequestPostItem[]>([]);
  const [requestData, setRequestData] = useState<IRequestData>({
    query: [],
    bodyFormData: [],
    bodyJSON: [],
    header: [],
    cookie: []
  });

  const { request: requestDetail, loading: loadingInit } = useRequest('/api/debugger/taskDetail', { lazy: true });
  const { request: requestCreateTest } = useRequest('/api/debugger/creatTestExp', { lazy: true });
  const {
    request: requestRun,
    loading: loadingRun,
    data: responseData
  } = useRequest('/api/debugger/runTask', { lazy: true });
  const { request: requestSave, loading: loadingSave } = useRequest('/api/debugger/saveTask', { lazy: true });

  // context
  const providerValue = {
    requestData,
    responseData,
    setRequestData,
    requestPostData,
    setRequestPostData
  };

  const onRun = () => {
    requestRun({
      method,
      url,
      env,
      request: requestData,
      requestPost: requestPostData
    });
  };

  const onSave = async () => {
    const res: any = await requestSave({
      key: pane.key,
      method,
      url,
      env,
      request: requestData,
      requestPost: requestPostData,
      isTest: isTestExample
    });
    if (typeof onSaveSuccess === 'function') {
      onSaveSuccess({
        pane: { ...pane, prevKey: pane.key, ...res }
      });
    }
  };

  const onInputChange = (e: any) => {
    const { value } = e.target;
    setUrl(value);
  };

  const onAddCase = (val: { name: string }) => {
    requestCreateTest({
      title: val.name,
      pkey: pane.key
    }).then((res: any) => {
      const node = { ...res };
      node.icon = () => <BugOutlined />;
      addChildTree(pane.key, [node]);
    });
  };

  useEffect(() => {
    if (pane && pane.key && pane.key !== '1') {
      requestDetail({ key: pane.key, pkey: pane.pkey }).then((res: any) => {
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
        if (res.requestPost) {
          setRequestPostData(res.requestPost);
        }
      });
    }
  }, [pane]);

  if (pane.key === '1') {
    return <DefaultContent />;
  }

  if (loadingInit) {
    return (
      <div className="rel" style={{ height: 300 }}>
        <div className="fetch-loading">
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <DegContext.Provider value={providerValue}>
      <div className="content-body">
        <div className="d-header flex-center">
          <div className="radius flex-center">
            {!isTestExample && (
              <div className={`method ${method}-color`}>
                <Dropdown overlay={<RenderMenu onClick={setMethod} />} trigger={['click']}>
                  <div>
                    {method.toLocaleUpperCase()} <CaretDownOutlined />
                  </div>
                </Dropdown>
              </div>
            )}
            {isTestExample && (
              <div className={`method ${method}-color`}>
                <span style={{ marginRight: 10 }}>{method.toLocaleUpperCase()}</span>
                <Tooltip placement="bottom" title="测试用例的URL需要父级保存才能生效哦~">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            )}
            <div className="input">
              {!isTestExample && (
                <Input placeholder='接口路径 "/"或"http"起始 ' onChange={onInputChange} defaultValue={pane.url} />
              )}
              {isTestExample && (
                <Input placeholder='接口路径 "/"或"http"起始 ' onChange={onInputChange} value={url} disabled />
              )}
            </div>
          </div>

          <div className="handler rel">
            {!isNew && (
              <Space>
                <Button type="primary" icon={<CaretRightOutlined />} onClick={onRun} loading={loadingRun}>
                  运行
                </Button>
                {!isTestExample && <TestCaseButton onAddCase={onAddCase} />}
                <Button type="default" icon={<SaveOutlined />} onClick={onSave} loading={loadingSave}>
                  保存
                </Button>
              </Space>
            )}
            {isNew && (
              <Space>
                <Button type="primary" icon={<SaveOutlined />} onClick={onSave} loading={loadingSave}>
                  保存
                </Button>
              </Space>
            )}
          </div>
        </div>

        <div className="content-scroll">
          <h2 className="title">请求参数：</h2>
          <div className="request">
            <Request isTestExample={isTestExample} />
          </div>

          <h2 className="title">响应结果：</h2>
          <div className="response">
            <Response />
          </div>
        </div>
      </div>
    </DegContext.Provider>
  );
});
