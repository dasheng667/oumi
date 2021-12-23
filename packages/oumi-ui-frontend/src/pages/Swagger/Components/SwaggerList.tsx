import React, { useState } from 'react';
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

const SwaggerList = (props: any) => {
  const { swaggerList, expandData = {}, expandCacheId, loadingId, onClickSwaggerHead, setSelectId, selectId, tabsId } = props;
  const [visible, setVisible] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [defaultActiveKey, setDefaultActiveKey] = useState('1');
  const { downloadFile } = useDownloadFile();
  const { request: requestJson, loading: loadingJson } = useRequest('/api/export/json', { lazy: true, methods: 'get' });
  const { request: requestTS, loading: loadingTS } = useRequest('/api/export/typescript', { lazy: true, methods: 'get' });
  const { request: requestMock, loading: loadingMock } = useRequest('/api/export/mock', { lazy: true, methods: 'get' });

  const onAllChange = (e: React.MouseEvent, item: any) => {
    const all = Object.keys(expandData[item.id] || {});

    if (selectId.includes(all[0])) {
      setSelectId(selectId.filter((k: string) => !all.includes(k)));
    } else {
      setSelectId([...selectId, ...all]);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const onChange = (key: string) => {
    if (selectId.includes(key)) {
      setSelectId(selectId.filter((k: string) => k !== key));
    } else {
      setSelectId([...selectId, key]);
    }
  };

  const setDrawerVisible = (flag: boolean) => {
    setVisible(flag);
  };

  const clickShowDrawer = (value: any, key: string) => {
    setDrawerVisible(true);
    setDefaultActiveKey('1');
    setDrawerData(null);
    setTimeout(() => {
      setDrawerData({ ...value, key });
    }, 200);
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
        {drawerData && drawerData.methods === 'post' && <Tag color="green">POST</Tag>}
        {drawerData && drawerData.methods === 'get' && <Tag color="blue">GET</Tag>}
        {drawerData && drawerData.methods === 'delete' && <Tag color="red">DELETE</Tag>}
        {drawerData && drawerData.methods === 'put' && <Tag color="volcano">PUT</Tag>}
      </>
    );
  };

  const onTabClick = (key: string) => {
    setDefaultActiveKey(key);
    const params = { isDownload: 0, id: tabsId, searchPath: drawerData?.key };
    if (key === '3' && !drawerData.code_Response) {
      requestJson(params).then((res) => {
        setDrawerData({ ...drawerData, code_Response: res });
      });
    }
    if (key === '4' && !drawerData.code_Mock) {
      requestMock(params).then((res) => {
        setDrawerData({ ...drawerData, code_Mock: res });
      });
    }
    if (key === '5' && !drawerData.code_TS) {
      requestTS(params).then((res) => {
        setDrawerData({ ...drawerData, code_TS: res });
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => downLoadMock(drawerData && drawerData.key)}>
        <span>
          <FileTextOutlined /> 导出 Response
        </span>
      </Menu.Item>
      <Menu.Item onClick={() => downLoadMockJS(drawerData && drawerData.key)}>
        <span>
          <ApiOutlined /> 导出 Mock
        </span>
      </Menu.Item>
      <Menu.Item onClick={() => downLoadTS(drawerData && drawerData.key)}>
        <span>
          <ControlOutlined /> 导出 TS
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="swagger-list">
      {swaggerList &&
        swaggerList.map((item: any) => {
          return (
            <div className="swagger-list-item" key={item.id}>
              <div className="heading" onClick={() => onClickSwaggerHead(item)}>
                <div className="options">
                  {(() => {
                    if (loadingId === item.id) {
                      return <LoadingOutlined />;
                    }
                    if (expandCacheId.includes(item.id)) {
                      return <CaretDownOutlined />;
                    }
                    return <CaretRightOutlined />;
                  })()}
                  {expandCacheId.includes(item.id) && (
                    <span className="all" onClick={(e) => onAllChange(e, item)}>
                      全选
                    </span>
                  )}
                </div>
                <h3>{item.name}</h3>
              </div>

              {expandCacheId.includes(item.id) && (
                <div className="content">
                  <ul className="content-list">
                    {/* <Checkbox.Group onChange={onChange}> */}
                    {expandData &&
                      expandData[item.id] &&
                      Object.keys(expandData[item.id]).map((key) => {
                        const value = expandData[item.id][key];
                        return (
                          <li className={`${value.methods || 'get'}`} key={key}>
                            <span className="checkbox">
                              <Checkbox value={key} onChange={() => onChange(key)} checked={selectId.includes(key)} />
                            </span>
                            <span className="methods">{(value.methods || 'get').toLocaleUpperCase()}</span>
                            <span className="path" onClick={() => clickShowDrawer(value, key)}>
                              {key}
                            </span>
                            <span className="desc" title={value.description} onClick={() => clickShowDrawer(value, key)}>
                              {value.description}
                            </span>
                            <span className="bg">
                              <CaretRightOutlined />
                            </span>
                          </li>
                        );
                      })}
                    {/* </Checkbox.Group> */}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

      <Drawer
        title={
          <span>
            <RenderMethods /> {(drawerData && (drawerData.description || drawerData.key)) || ''}
          </span>
        }
        placement="right"
        closable={false}
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
      >
        <div style={{ position: 'relative', top: -10, overflow: 'hidden' }}>
          <Space>路径:{drawerData && drawerData.key}</Space>
        </div>
        <Tabs className="tabs-oumi" activeKey={defaultActiveKey} type="card" onTabClick={onTabClick} style={{ marginBottom: 32 }}>
          <TabPane tab="默认" key="1" forceRender={false}>
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
          </TabPane>
          <TabPane tab="Mock" key="4">
            {loadingMock && <Spin />}
            <Code code={drawerData?.code_Mock} lang="javascript" isCopy />
          </TabPane>
          <TabPane tab="TypeScript" key="5">
            {loadingTS && <Spin />}
            <Code code={drawerData?.code_TS} lang="javascript" isCopy />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default SwaggerList;
