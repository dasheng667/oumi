import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useRequest } from '@src/hook';
import type { ListItem, IRouter, Blocks as IBlocks } from '@src/typings/app';
import Blocks from './Components/Blocks';
import DownloadModal from './Components/DownloadModal';
import ViewCode from './Components/ViewCode';
import Container from '../Container';

import './index.less';

const { TabPane } = Tabs;

type Props = {
  route: IRouter;
  [key: string]: any;
};

const BlocksList = ({
  current,
  blockList,
  onChange
}: {
  current: ListItem | null;
  blockList: ListItem[];
  onChange: (block: ListItem) => void;
}) => {
  if (!Array.isArray(blockList)) return null;
  return (
    <div className="blocks-tab">
      {blockList.map((item) => {
        return (
          <div className={`blocks-tab-item ${current?.href === item.href ? 'active' : ''}`} key={item.href} onClick={() => onChange(item)}>
            <ShoppingOutlined /> &nbsp;&nbsp; {item.name}
          </div>
        );
      })}
    </div>
  );
};

export default (props: Props) => {
  const { route = {} } = props;
  // console.log('props', props)

  const [codeBlockItem, setCodeItemItem] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<ListItem | null>(null);
  const [modalData, setModalData] = useState<IBlocks | null>(null);
  const history = useHistory();

  const { data: blockList = [] } = useRequest<ListItem[]>('/api/block/getList');

  const onChangeTab = (item: ListItem) => {
    if (item.href === currentTab?.href) return;
    setCurrentTab(item);
  };

  const addToProject = (block: IBlocks) => {
    setModalData(block);
  };

  const viewToProject = (block: IBlocks) => {
    setCodeItemItem(block);
  };

  return (
    <Container isMain title="资产" className="dashboard-main">
      <div className="dashboard-body">
        <div className="ui-dashboard-content">
          <div className="ui-content-container blocks-container">
            <BlocksList current={currentTab} blockList={blockList} onChange={onChangeTab} />
          </div>

          {currentTab && <Blocks item={currentTab} addToProject={addToProject} viewToProject={viewToProject} />}
        </div>

        <DownloadModal modalData={modalData} setModalVisible={setModalData} />

        <ViewCode modalData={codeBlockItem} currentTab={currentTab} setModalVisible={setCodeItemItem} />
      </div>
    </Container>
  );
};
