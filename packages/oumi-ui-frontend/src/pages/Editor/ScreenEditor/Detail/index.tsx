import React, { memo, useRef, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import DragToContainer from '../../Components/DragToContainer';
// import { EditorDragType } from './config';

const HeaderComponent = () => {
  const components = [
    {
      name: 'Card'
    }
  ];
  return (
    <div className="editor-main-body__header">
      <span>组件：</span>
      {components.map((v) => {
        return (
          <span key={v.name} className="editor-main-body__header__component">
            {v.name}
          </span>
        );
      })}
    </div>
  );
};

export default memo((props: any) => {
  // const { fields } = props;

  const dropCallback = (dropData: any) => {
    console.log('dropData:', dropData);
  };

  return (
    <DragToContainer className="editor-main-body" dropCallback={dropCallback}>
      <HeaderComponent />
    </DragToContainer>
  );
});
