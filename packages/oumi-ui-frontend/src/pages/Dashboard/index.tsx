import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';
import { Tabs, Spin, Modal } from 'antd';
import Slider from '../../Components/Slider';
import { useRequest } from '../../hook';
import type { ListItem, IRouter, Blocks as IBlocks } from '../../global';
import renderRoutes from '../../router/renderRoutes';
import Blocks from './Components/Blocks';
import DownloadModal from './Components/DownloadModal';

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
  const isCurrentPath = history.location.pathname === '/dashboard';

  const { data, error, request: requestGet } = useRequest<ListItem>('/api/dashboard/init', { errorMsg: false });
  const { data: blockList = [], request: requestBlockList } = useRequest<ListItem[]>('/api/block/getList', {
    lazy: true
  });

  const goProjectList = () => {
    history.push(projectListPath);
  };

  useEffect(() => {
    if (isCurrentPath) {
      requestBlockList();
    }
  }, [history, history.location]);

  useEffect(() => {
    if (error) {
      history.replace(projectListPath);
    }
  }, [error]);

  const addToProject = (block: IBlocks) => {
    setModalData(block);
  };

  if (error) {
    return (
      <div style={{ padding: 50 }}>
        <Link to={projectListPath}>选择项目</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <Slider goProjectList={goProjectList} selectItem={data} />
      <div className="dashboard-body">
        {renderRoutes(route.routes)}

        {isCurrentPath && (
          <div className="content">
            <div className="ui-dashboard-content">
              <div className="top-header">
                <h2>资产</h2>
              </div>
              <div className="ui-content-container ui-main-container">
                <Tabs type="line" defaultActiveKey={'1'} tabPosition="left">
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
          </div>
        )}

        <DownloadModal modalData={modalData} setModalVisible={setModalData} />
      </div>
    </div>
  );
};
