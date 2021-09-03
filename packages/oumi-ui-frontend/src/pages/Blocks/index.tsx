import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useRequest } from '@src/hook';
import Slider from '../../Components/Slider';
import type { ListItem, IRouter, Blocks as IBlocks } from '../../global';
import renderRoutes from '../../router/renderRoutes';
import Blocks from './Components/Blocks';
import DownloadModal from './Components/DownloadModal';
import Container from '../Container';

import './index.less';

const projectListPath = '/project/select';

const { TabPane } = Tabs;

type Props = {
  route: IRouter;
  [key: string]: any;
};

export default (props: Props) => {
  const { route = {} } = props;
  // console.log('props', props)

  const [modalData, setModalData] = useState<IBlocks | null>(null);
  const history = useHistory();

  const { data: blockList = [], request: requestBlockList } = useRequest<ListItem[]>('/api/block/getList');

  const addToProject = (block: IBlocks) => {
    setModalData(block);
  };

  return (
    <Container title="资产" className="dashboard-main">
      <div className="dashboard-body">
        <div className="ui-dashboard-content">
          <div className="ui-content-container ui-main-container">
            <Tabs className="tabs-oumi" type="line" defaultActiveKey={'1'} tabPosition="left">
              {blockList &&
                blockList.map((item) => {
                  return (
                    <TabPane
                      forceRender={false}
                      tab={
                        <span>
                          {' '}
                          <ShoppingOutlined /> {item.name}{' '}
                        </span>
                      }
                      key={item.id}
                      closable={false}
                    >
                      <Blocks item={item} addToProject={addToProject} />
                    </TabPane>
                  );
                })}
            </Tabs>
          </div>
        </div>
        <DownloadModal modalData={modalData} setModalVisible={setModalData} />
      </div>
    </Container>
  );
};
