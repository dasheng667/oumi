import React, { memo, useRef, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import DragButton from './Components/DragButton';
import DragToContainer from './Components/DragToContainer';
import ScreenEditorDetail from './ScreenEditor/Detail';
import { EditorDragType } from './config';

type IFields = {
  key: string;
  fieldType: string;
  description: string;
};

export default memo((props: { fields: IFields[] }) => {
  const { fields } = props;
  console.log('fields:', fields);

  const dropCallback = (item: any) => {
    console.log('dropCallback.item:', item);
  };

  return (
    <div className="editor-main">
      <div className="editor-fields">
        <div className="editor-fields-wrapper">
          {fields.length === 0 && <div>无数据</div>}
          {fields.map((v) => {
            return (
              <DragButton className="editor-fields__item" key={v.key} dragType={EditorDragType} itemData={v}>
                <div key={v.key}>
                  <p>{v.key}</p>
                  <small>{v.description}</small>
                </div>
              </DragButton>
            );
          })}
        </div>
      </div>
      <div className="editor-main-content">
        {/* <DragToContainer className="editor-drag-container" dropCallback={dropCallback}></DragToContainer> */}
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Antd Detail" key="1">
            <ScreenEditorDetail />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Antd Table List" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
});
