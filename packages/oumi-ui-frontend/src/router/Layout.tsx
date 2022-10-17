import React, { memo, useEffect, useState, useReducer, useMemo } from 'react';
import { Tabs } from 'antd';
import { useHistory } from 'react-router-dom';
import routers from './index';
import renderRoutes from './renderRoutes';
import Slider from '../Components/Slider';
import { CacheContext, useCacheContext, CacheReducer, CacheType } from '@src/cache/context';

const CacheTab = memo(() => {
  const history = useHistory();
  const { location } = history;
  const { state, dispatch } = useCacheContext();

  useEffect(() => {
    if (location.pathname !== '/') {
      dispatch({ type: CacheType.ADD_CACHE, payload: location });
    }
  }, [location]);

  const routerAll = routers[0].routes;

  return (
    <div className="root-container-main-tab">
      <Tabs
        className="cache-tabs"
        type="editable-card"
        hideAdd
        // activeKey={activeKey}
        // onEdit={this.handleTabRemove}
        // onChange={this.onChange}
      >
        {state.cacheList.map((item) => {
          const find = routerAll?.find((v) => v.path === item.pathname);
          return <Tabs.TabPane tab={find?.label || '页面'} key={item.pathname} />;
        })}
      </Tabs>
    </div>
  );
});

const Layout = memo(({ route }: any) => {
  const history = useHistory();
  const { location } = history;
  const [visible, setVisible] = useState(false);

  const store = useReducer(CacheReducer, { cacheList: [] });

  useEffect(() => {
    setVisible(location.pathname !== '/project/select');
  }, [history, history.location]);

  const value = useMemo(() => {
    return {
      state: store[0],
      dispatch: store[1]
    };
  }, [store]);

  return (
    <>
      {visible && <Slider />}
      <CacheContext.Provider value={value}>
        <div className="root-container">
          <CacheTab />
          {renderRoutes(route.routes)}
        </div>
      </CacheContext.Provider>
    </>
  );
});

export default Layout;
