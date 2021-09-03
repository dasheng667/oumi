import React, { useState, useEffect } from 'react';
import { Tabs, Menu, Radio } from 'antd';
import EditTable from './EditTable';
import RequestFront from './RequestFront';
import RequestPost from './RequestPost';
import { useDegContext } from '../context';

import type { IRequestDataKey, EditTableItem } from '../type';

// import { CaretDownOutlined, CaretRightOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

interface Props {
  isTestExample: boolean | undefined;
}

export default (props: Props) => {
  const { setRequestData, requestData } = useDegContext();
  if (!requestData) return null;

  const { isTestExample } = props;
  const [tabFlag, setTabFlag] = useState(false);
  const [tabsKey, setTabsKey] = useState('6');
  const [radioValue, setRadioValue] = useState(1);

  useEffect(() => {
    // 跳转对应的tab
    if (requestData && tabFlag === false && 0) {
      if (requestData.bodyFormData && Object.keys(requestData.bodyFormData).length > 0) {
        setTabsKey('2');
        setRadioValue(2);
        setTabFlag(true);
      } else if (requestData.bodyJSON && Object.keys(requestData.bodyJSON).length > 0) {
        setTabsKey('2');
        setRadioValue(3);
        setTabFlag(true);
      } else if (requestData.query && requestData.query.length > 0) {
        setTabsKey('1');
        setTabFlag(true);
      } else if (requestData.header && requestData.header.length > 0) {
        setTabsKey('3');
        setTabFlag(true);
      }
    }
  }, [requestData, tabFlag]);

  const onChangeBody = (e: any) => {
    const { value } = e.target;
    setRadioValue(value);
  };

  const onTableChange = (key: IRequestDataKey, data: EditTableItem[]) => {
    setRequestData({ [key]: data } as any);
  };

  return (
    <Tabs activeKey={tabsKey} onChange={(key) => setTabsKey(key)}>
      <TabPane tab="Params" key="1">
        <EditTable
          tableData={requestData.query}
          tableTitle="Query参数"
          onEditChange={(data) => onTableChange('query', data)}
        />
      </TabPane>
      <TabPane tab="Body" key="2">
        <Radio.Group onChange={onChangeBody} name="bodyRadioGroup" value={radioValue}>
          <Radio value={1}>none</Radio>
          <Radio value={2}>form-data</Radio>
          <Radio value={3}>json</Radio>
        </Radio.Group>
        {radioValue === 1 && <div className="body-none">该请求无 Body </div>}
        {radioValue === 2 && (
          <div>
            <EditTable
              tableData={requestData.bodyFormData}
              onEditChange={(data) => onTableChange('bodyFormData', data)}
            />
          </div>
        )}
        {radioValue === 3 && (
          <div>
            <EditTable tableData={requestData.bodyJSON} onEditChange={(data) => onTableChange('bodyJSON', data)} />
          </div>
        )}
      </TabPane>
      <TabPane tab="Header" key="3">
        <EditTable tableData={requestData.header} onEditChange={(data) => onTableChange('header', data)} />
      </TabPane>
      <TabPane tab="Cookie" key="4">
        <EditTable tableData={requestData.cookie} onEditChange={(data) => onTableChange('cookie', data)} />
      </TabPane>

      {isTestExample && (
        <TabPane tab="接口前置" key="5">
          <RequestFront />
        </TabPane>
      )}

      {isTestExample && (
        <TabPane tab="接口后置" key="6">
          <RequestPost />
        </TabPane>
      )}
    </Tabs>
  );
};
