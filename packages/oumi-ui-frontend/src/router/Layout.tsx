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
      dispatch({ type: CacheType.LISTEN_CACHE, payload: location });
    }
  }, [location]);

  const routerAll = routers[0].routes;
  const activeKey = state.cacheList[state.activeIndex]?.pathname;

  const handleTabRemove = (v: React.MouseEvent | React.KeyboardEvent | string) => {
    dispatch({
      type: CacheType.REMOVE_CACHE,
      payload: {
        value: v,
        callback: ({ isCurrent, prevItem }: any) => {
          if (isCurrent) {
            history.replace(prevItem.pathname);
          }
        }
      }
    });
  };

  const onChange = (v: string) => {
    const find = state.cacheList.find((item) => item.pathname === v);
    if (find) {
      dispatch({ type: CacheType.ACTIVE_KEY, payload: find?.pathname });
      history.push(`${find?.pathname}${find?.search}`);
    }
  };

  return (
    <div className="root-container-main-tab">
      <Tabs className="cache-tabs" type="editable-card" hideAdd activeKey={activeKey} onEdit={handleTabRemove} onChange={onChange}>
        {state.cacheList.map((item) => {
          const find = routerAll?.find((v) => v.path === item.pathname);
          const title = item.state ? item.state?.title : find?.label;
          return <Tabs.TabPane tab={title || '页面'} key={item.pathname} />;
        })}
      </Tabs>
    </div>
  );
});

const Layout = memo(({ route }: any) => {
  const history = useHistory();
  const { location } = history;
  const [visible, setVisible] = useState(false);

  const store = useReducer(CacheReducer, { cacheList: [], activeIndex: 0 });

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
