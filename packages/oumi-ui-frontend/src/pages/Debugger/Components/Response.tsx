import React, { useState } from 'react';
import { Tabs, Radio } from 'antd';
import Code from '../../../Components/Code';
import EditTable from './EditTable';
// import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface Props {}

export default (props: Props) => {
  const [radioValue, setRadioValue] = useState('pretty');

  const onChangeBody = (e: any) => {
    const { value } = e.target;
    setRadioValue(value);
  };

  return (
    <div className="rel">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Body" key="1">
          <Radio.Group onChange={onChangeBody} value={radioValue}>
            <Radio.Button value="pretty">Pretty</Radio.Button>
            <Radio.Button value="preview">Preview</Radio.Button>
          </Radio.Group>
          {radioValue === 'pretty' && (
            <div className="response-body">
              <Code code={{ a: 'a' }}></Code>
            </div>
          )}
          {radioValue === 'preview' && (
            <div className="response-body">
              <Code code={JSON.stringify({ a: 'a' })}></Code>
            </div>
          )}
        </TabPane>
        {/* <TabPane tab="Cookie" key="2"></TabPane> */}
        <TabPane tab="Header" key="3">
          <div className="list-line">
            <div className="list-line_item">
              <span className="name">名称</span>
              <span className="value">值</span>
            </div>
            <div className="list-line_item">
              <span className="name">Server</span>
              <span className="value">openresty</span>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <div className="response-status">
        <span>
          状态码: <u>200 OK</u>
        </span>{' '}
        <span>
          耗时: <u>132 ms</u>
        </span>{' '}
        <span>
          大小: <u>36.84 K</u>
        </span>
      </div>
    </div>
  );
};
