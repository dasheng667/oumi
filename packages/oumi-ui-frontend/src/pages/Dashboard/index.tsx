import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useHistory, Link, Switch, Route } from 'react-router-dom';
import { Tabs, Spin } from 'antd';
import Slider from '../../Components/Slider';
import { useRequest } from '../../hook';
import type { ListItem, IRouter } from '../../global';
import renderRoutes from '../../router/renderRoutes';
import Blocks from './Components/Blocks';

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
  // const [tabsId, setTabsId] = useState('');
  const history = useHistory();
  const isCurrentPath = history.location.pathname === '/dashboard';

  const {
    data,
    error,
    request: requestGet
  } = useRequest<ListItem>('/api/dashboard/get', { errorMsg: false, lazy: true });
  const { data: blockList = [], request: requestBlockList } = useRequest<ListItem[]>('/api/block/getList', {
    lazy: true
  });

  const goProjectList = () => {
    history.push(projectListPath);
  };

  useEffect(() => {
    if (isCurrentPath) {
      requestGet();
      requestBlockList();
    }
  }, [history, history.location]);

  useEffect(() => {
    if (error) {
      history.replace(projectListPath);
    }
  }, [error]);

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
                <h2>模版</h2>
              </div>
              <div className="ui-content-container ui-main-container">
                <Tabs type="card" defaultActiveKey={'1'} tabPosition="left">
                  {blockList &&
                    blockList.map((item) => {
                      return (
                        <TabPane forceRender={false} tab={item.name} key={item.id}>
                          <Blocks item={item} />
                        </TabPane>
                      );
                    })}
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
