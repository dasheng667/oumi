import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Spin, message } from 'antd';
import { useRequest } from '../../hook';
import { createId } from './utils';
import Search from './Components/Search';
import SwaggerList from './Components/SwaggerList';
import ProjectDirs from './Components/ProjectDirs';

import './index.less';

const { TabPane } = Tabs;

const Container = (props: any) => {
  return (
    <div className="ui-swagger-content">
      <div className="top-header">
        <h2>Swagger</h2>
      </div>
      <div className="ui-content-container ui-swagger-container">{props.children}</div>
    </div>
  );
};

const NoSwagger = () => {
  return (
    <Container>
      <div className="swagger-error">
        您当前还没有配置Swagger，去 <Link to="/dashboard/config">配置</Link> 。
      </div>
    </Container>
  );
};

export default () => {
  const [tabsId, setTabsId] = useState('');
  const { data, error, loading: loadingGet } = useRequest<any[]>('/api/config/swagger/get');

  const {
    data: swaggerData,
    loading: loadingSwagger,
    request: requestSwagger,
    source
  } = useRequest<any>('/api/swagger/info', { lazy: true });

  const { request: requestSearchSwagger } = useRequest<any>('/api/swagger/search', { lazy: true });

  const [swaggerList, setSwaggerList] = useState<{ name: string; description: string; id: string }[]>([]);
  const [expandData, setExpandData] = useState<Record<string, any>>({});
  const [loadingId, setLoadingId] = useState(''); // 子列表loading
  const [expandCacheId, setExpandCache] = useState<string[]>([]); // 缓存已展开的列表id
  const [selectId, setSelectId] = useState<string[]>([]); // 已选中的api

  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setTabsId(data[0].id);
    }
  }, [data]);

  useEffect(() => {
    if (swaggerData && Array.isArray(swaggerData.tags)) {
      setSwaggerList(swaggerData.tags.map((item: any) => ({ ...item, id: createId(8) })));
    }
  }, [swaggerData]);

  useEffect(() => {
    if (tabsId) {
      requestSwagger({ id: tabsId });
    }
  }, [tabsId]);

  const onTabClick = (key: string) => {
    setTabsId(key);
  };

  // 展开子列表
  const onClickSwaggerHead = (item: any) => {
    if (expandCacheId.includes(item.id)) {
      setExpandCache(expandCacheId.filter((id) => id !== item.id));
      return;
    }

    if (expandData[item.id]) {
      setExpandCache([...expandCacheId, item.id]);
      return;
    }

    setLoadingId(item.id);

    requestSearchSwagger({
      configId: tabsId,
      searchTag: item.name
    }).then((res: any) => {
      setLoadingId('');
      if (typeof res === 'object' && Object.keys(res || {}).length > 0) {
        const newData: any = {};
        Object.keys(res).forEach((key) => {
          newData[key] = {
            description: res[key].description,
            methods: res[key].methods
          };
        });
        setExpandCache([...expandCacheId, item.id]);
        setExpandData({
          ...expandData,
          [item.id]: newData
        });
      } else {
        message.warning('没有数据');
      }
    });
  };

  // 表单搜索
  const onFinish = (val: { name: string }) => {
    const { name } = val;
    if (!name) {
      requestSwagger({ id: tabsId });
    } else {
      const id = createId(8);
      setSwaggerList([{ name, description: '', id }]);
      setExpandCache([id]);
      setLoadingId(id);
      setSelectId([]);

      const reg = /[\u4e00-\u9fa5]+/g;
      const query =
        name.toLocaleUpperCase().startsWith('V') || reg.test(name) ? { searchTag: name } : { searchPath: name };

      requestSearchSwagger({
        configId: tabsId,
        ...query
      }).then((res: any) => {
        setLoadingId('');
        if (typeof res === 'object' && Object.keys(res || {}).length > 0) {
          const newData: any = {};
          Object.keys(res).forEach((key) => {
            newData[key] = {
              description: res[key].description,
              methods: res[key].methods
            };
          });
          setExpandData({
            [id]: newData
          });
        } else {
          message.warning('没有数据');
        }
      });
    }
  };

  if (loadingGet) {
    return (
      <Container>
        <Spin />
      </Container>
    );
  }

  if (error || !Array.isArray(data) || data.length === 0) {
    return <NoSwagger />;
  }

  return (
    <Container>
      <Tabs type="card" defaultActiveKey={tabsId} onTabClick={onTabClick}>
        {data && data.map((item) => <TabPane tab={item.name} key={item.id} />)}
      </Tabs>

      <div className="tabs-content">
        {loadingSwagger && (
          <div className="fetch-loading">
            <Spin />
          </div>
        )}

        <div className="flex align-items">
          <Search onFinish={onFinish} />
          <div className="plp2">已选中{selectId.length}个</div>
        </div>

        <div className="body-flex">
          <SwaggerList
            selectId={selectId}
            setSelectId={setSelectId}
            swaggerList={swaggerList}
            loadingId={loadingId}
            expandCacheId={expandCacheId}
            expandData={expandData}
            onClickSwaggerHead={onClickSwaggerHead}
          />
          <ProjectDirs selectId={selectId} configId={tabsId} />
        </div>
      </div>
    </Container>
  );
};
