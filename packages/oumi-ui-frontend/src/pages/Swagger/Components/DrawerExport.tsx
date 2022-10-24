import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Checkbox, Drawer, Tabs, Tag, Button, Space, Tooltip, Dropdown, Menu, Spin } from 'antd';
import { toResponseJSON } from '@src/utils';
import { useDownloadFile, useRequest } from '@src/hook';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  LoadingOutlined,
  FileTextOutlined,
  ControlOutlined,
  ApiOutlined,
  DownOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';
import Code from '../../../Components/Code';

const { TabPane } = Tabs;

const DrawerExport = (props: any, ref: any) => {
  const { url = '', tabsId, methods, description } = props;
  const [visible, setVisible] = useState(false);
  const [defaultActiveKey, setDefaultActiveKey] = useState('4');
  const [code_Mock, setMockCode] = useState('');
  const [code_TS, setTSCode] = useState('');
  const { downloadFile } = useDownloadFile();
  const { request: requestJson, loading: loadingJson } = useRequest<string>('/api/export/json', { lazy: true, methods: 'get' });
  const { request: requestTS, loading: loadingTS } = useRequest<string>('/api/export/typescript', { lazy: true, methods: 'get' });
  const { request: requestMock, loading: loadingMock } = useRequest<string>('/api/export/mock', { lazy: true, methods: 'get' });

  const showDrawer = () => {
    onTabClick('4');
    setVisible(true);
  };

  const hiddenDrawer = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => {
    return {
      show: showDrawer,
      hide: hiddenDrawer
    };
  });

  const setDrawerVisible = (flag: boolean) => {
    setVisible(flag);
  };

  const downLoadMock = (path: string) => {
    if (!path) return;
    downloadFile('/api/export/json', { params: { id: tabsId, searchPath: path } });
  };

  const downLoadTS = (path: string) => {
    if (!path) return;
    downloadFile('/api/export/typescript', { params: { id: tabsId, searchPath: path } });
  };

  const downLoadMockJS = (path: string) => {
    if (!path) return;
    downloadFile('/api/export/mock', { params: { id: tabsId, searchPath: path } });
  };

  const RenderMethods = () => {
    return (
      <>
        {methods === 'post' && <Tag color="green">POST</Tag>}
        {methods === 'get' && <Tag color="blue">GET</Tag>}
        {methods === 'delete' && <Tag color="red">DELETE</Tag>}
        {methods === 'put' && <Tag color="volcano">PUT</Tag>}
      </>
    );
  };

  const onTabClick = (key: string) => {
    setDefaultActiveKey(key);
    const params = { isDownload: 0, id: tabsId, searchPath: url };
    // if (key === '3' && !drawerData.code_Response) {
    //   requestJson(params).then((res) => {
    //     // setDrawerData({ ...drawerData, code_Response: res });
    //     setMockCode(res);
    //   });
    // }
    if (key === '4') {
      requestMock(params).then((res) => {
        setMockCode(res);
      });
    } else if (key === '5') {
      requestTS(params).then((res) => {
        setTSCode(res);
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => downLoadMock(url)}>
        <span>
          <FileTextOutlined /> 导出 Response
        </span>
      </Menu.Item>
      <Menu.Item onClick={() => downLoadMockJS(url)}>
        <span>
          <ApiOutlined /> 导出 Mock
        </span>
      </Menu.Item>
      <Menu.Item onClick={() => downLoadTS(url)}>
        <span>
          <ControlOutlined /> 导出 TS
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Drawer
      title={
        <span>
          <RenderMethods /> {description}
        </span>
      }
      placement="right"
      onClose={() => setDrawerVisible(false)}
      visible={visible}
      width={880}
      extra={
        <div style={{ paddingRight: 50 }}>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              <CloudDownloadOutlined /> 导出数据 <DownOutlined />
            </a>
          </Dropdown>
        </div>
      }
      destroyOnClose
      // style={{ position: 'absolute' }}
      // getContainer={document.getElementById('root-content') as HTMLElement}
    >
      <div style={{ position: 'relative', top: -10, overflow: 'hidden' }}>
        <Space>路径:{url}</Space>
      </div>
      <Tabs className="tabs-oumi" activeKey={defaultActiveKey} type="card" onTabClick={onTabClick} style={{ marginBottom: 32 }}>
        {/* <TabPane tab="默认" key="1" forceRender={false}>
          <h3 className="mbm5">请求头（Request）：</h3>
          <Code code={drawerData && toResponseJSON(drawerData.request, { resultValueType: 'type' })} />
          <h3 className="mbm5">响应（Response）：</h3>
          <Code code={drawerData && toResponseJSON(drawerData.response, { resultValueType: 'desc' })} />
        </TabPane>
        <TabPane tab="详细" key="2" forceRender={false}>
          <h3 className="mbm5">请求头（Request）：</h3>
          <Code code={drawerData && drawerData.request} />
          <h3 className="mbm5">响应（Response）：</h3>
          <Code code={drawerData && drawerData.response} />
        </TabPane>
        <TabPane tab="Response" key="3">
          {loadingJson && <Spin />}
          <Code code={drawerData?.code_Response} isCopy />
        </TabPane> */}
        <TabPane tab="Mock" key="4">
          {loadingMock && <Spin />}
          <Code code={code_Mock} lang="javascript" isCopy />
        </TabPane>
        <TabPane tab="TypeScript" key="5">
          {loadingTS && <Spin />}
          <Code code={code_TS} lang="javascript" isCopy />
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default forwardRef(DrawerExport);
