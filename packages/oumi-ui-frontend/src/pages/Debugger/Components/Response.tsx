import React, { useState } from 'react';
import { Tabs, Radio } from 'antd';
import Code from '../../../Components/Code';
import EditTable from './EditTable';
// import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface Props {
  responseData: any;
}

export default (props: Props) => {
  const { responseData } = props;
  const { header = {}, body = '', isJSON, status, statusText, timer, requestHeader } = responseData || {};
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
              <Code code={body}></Code>
            </div>
          )}
          {radioValue === 'preview' && (
            <div className="response-body">
              <Code code={typeof body === 'object' ? JSON.stringify(body) : body}></Code>
            </div>
          )}
        </TabPane>
        {/* <TabPane tab="Cookie" key="2"></TabPane> */}
        <TabPane tab="Response Headers" key="3">
          <div className="list-line">
            <div className="list-line_item">
              <span className="name">名称</span>
              <span className="value">值</span>
            </div>
            {header &&
              Object.keys(header).map((key) => {
                const val = header[key];
                return (
                  <div className="list-line_item" key={key}>
                    <span className="name">{key}</span>
                    <span className="value">{Array.isArray(val) ? val[0] : val}</span>
                  </div>
                );
              })}
          </div>
        </TabPane>
        <TabPane tab="Request Headers" key="4">
          <div className="list-line">
            <div className="list-line_item">
              <span className="name">名称</span>
              <span className="value">值</span>
            </div>
            {requestHeader &&
              Object.keys(requestHeader).map((key) => {
                const val = requestHeader[key] || '';
                return (
                  <div className="list-line_item" key={key}>
                    <span className="name">{key}</span>
                    <span className="value" title={val}>
                      {val}
                    </span>
                  </div>
                );
              })}
          </div>
        </TabPane>
      </Tabs>
      <div className="response-status">
        <span>
          状态码:{' '}
          <u>
            {status} {statusText}
          </u>
        </span>{' '}
        <span>
          耗时: <u>{timer} ms</u>
        </span>{' '}
        {/* <span>
          大小: <u>36.84 K</u>
        </span> */}
      </div>
    </div>
  );
};
