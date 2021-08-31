import React, { useState } from 'react';
import { Tabs, Menu, Radio } from 'antd';
import type { Panes } from '../type';
import EditTable from './EditTable';
// import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

type IRequestData = {
  query: any[];
  bodyFormData: any[];
  header: any[];
  cookie: any[];
};

interface Props {
  requestData: IRequestData;
  setRequestData: (data: any) => void;
}

export default (props: Props) => {
  const { setRequestData, requestData } = props;
  const [radioValue, setRadioValue] = useState(1);

  const onChangeBody = (e: any) => {
    const { value } = e.target;
    setRadioValue(value);
  };

  const onTableChange = (key: string, data: any) => {
    setRequestData({ [key]: data });
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Params" key="1">
        <EditTable
          tableData={requestData.query}
          tableTitle="Query参数"
          onChange={(data) => onTableChange('query', data)}
        />
      </TabPane>
      <TabPane tab="Body" key="2">
        <Radio.Group onChange={onChangeBody} name="bodyRadioGroup" value={radioValue}>
          <Radio value={1}>none</Radio>
          <Radio value={2}>form-data</Radio>
          {/* <Radio value={3}>x-www-form-urlencoded</Radio> */}
          {/* <Radio value={4}>json</Radio> */}
        </Radio.Group>
        {radioValue === 1 && <div className="body-none">该请求无 Body </div>}
        {radioValue === 2 && (
          <div>
            <EditTable tableData={requestData.bodyFormData} onChange={(data) => onTableChange('bodyFormData', data)} />
          </div>
        )}
      </TabPane>
      <TabPane tab="Header" key="3">
        <EditTable tableData={requestData.header} onChange={(data) => onTableChange('header', data)} />
      </TabPane>
      <TabPane tab="Cookie" key="4">
        <EditTable tableData={requestData.cookie} onChange={(data) => onTableChange('cookie', data)} />
      </TabPane>
    </Tabs>
  );
};
