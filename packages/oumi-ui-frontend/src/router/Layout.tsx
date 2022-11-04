import React, { memo, useEffect, useState, useReducer, useMemo } from 'react';
import { Tabs, message } from 'antd';
import { useHistory } from 'react-router-dom';
import routers from './index';
import renderRoutes from './renderRoutes';
import Slider from '../Components/Slider';
import { CacheContext, useCacheContext, CacheReducer, CacheType } from '@src/context/cache';

message.config({
  top: 130,
  duration: 2,
  maxCount: 3,
  rtl: true
});

type TabTitleProps = { title: string };

const MAX_TITLE_LENGTH = 15;

const TabTitle = memo((props: TabTitleProps) => {
  const { title } = props;
  const titleContent = useMemo(() => {
    if (title.length >= MAX_TITLE_LENGTH) {
      return `${title.slice(0, MAX_TITLE_LENGTH)}...`;
    }
    return title;
  }, [title]);

  return <span>{titleContent}</span>;
});

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
            history.replace(prevItem.pathname + prevItem.search);
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
      <Tabs className="root-cache-tabs" type="editable-card" hideAdd activeKey={activeKey} onEdit={handleTabRemove} onChange={onChange}>
        {state.cacheList.map((item) => {
          const find = routerAll?.find((v) => v.path === item.pathname);
          const title = item.state ? item.state?.title : find?.label;
          return <Tabs.TabPane tab={<TabTitle title={title || '页面'} />} key={item.pathname} />;
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
    <React.Fragment>
      {visible && <Slider />}
      <CacheContext.Provider value={value}>
        <div className="root-container">
          <CacheTab />
          <div id="root-content">{renderRoutes(route.routes)}</div>
        </div>
      </CacheContext.Provider>
    </React.Fragment>
  );
});

export default Layout;
