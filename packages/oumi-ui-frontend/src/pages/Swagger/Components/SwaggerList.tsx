import React, { useState } from 'react';
import { Checkbox, Drawer, Tabs } from 'antd';
import { toResponseJSON } from '../utils';
import { CaretDownOutlined, CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import Code from '../../../Components/Code';

const { TabPane } = Tabs;

const SwaggerList = (props: any) => {
  const { swaggerList, expandData = {}, expandCacheId, loadingId, onClickSwaggerHead, setSelectId, selectId } = props;
  const [visible, setVisible] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [defaultActiveKey, setDefaultActiveKey] = useState('1');

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
                            <span
                              className="desc"
                              title={value.description}
                              onClick={() => clickShowDrawer(value, key)}
                            >
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
        title={(drawerData && (drawerData.description || drawerData.key)) || ''}
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={visible}
        width={800}
      >
        <p style={{ position: 'relative', top: -10 }}>路径: {drawerData && drawerData.key}</p>
        <Tabs
          className="tabs-oumi"
          activeKey={defaultActiveKey}
          type="card"
          onTabClick={(key) => setDefaultActiveKey(key)}
          style={{ marginBottom: 32 }}
        >
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
        </Tabs>
      </Drawer>
    </div>
  );
};

export default SwaggerList;
