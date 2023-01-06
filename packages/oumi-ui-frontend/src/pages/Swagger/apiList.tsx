import React, { memo, useEffect, useState, useRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { CloseCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { Tabs, Spin, message, Popover, Form, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useRequest, useEvent } from '@src/hook';
import { createId } from '@src/utils';
import Search from './Components/Search';
import Container from '../Container';
import SwaggerList from './Components/SwaggerList';
// import ProjectDirs from './Components/ProjectDirs';
import getTags from './getTags';
import DrawerDirs from './Components/DrawerDirs';

import './less/index.less';

const { TabPane } = Tabs;

const NoSwagger = () => {
  return (
    <Container title="Swagger">
      <div className="swagger-error">
        您当前还没有配置Swagger，去 <Link to="/config">配置</Link> 。
      </div>
    </Container>
  );
};

export default memo(() => {
  const history = useHistory();
  const { params }: any = useRouteMatch();
  const tabsId = params?.id;
  // const [visible, setVisible] = useState(false);
  const { data, error, loading: loadingGet } = useRequest<any[]>('/api/config/swagger/get');
  const [form] = Form.useForm();
  const dirsRef = useRef<any>(null);

  const { data: swaggerData, loading: loadingSwagger, request: requestSwagger } = useRequest<any>('/api/swagger/info', { lazy: true });
  const { data: buildData, loading, request: requestSwaggerBuild } = useRequest('/api/swagger/build', { lazy: true });

  const { request: requestSearchSwagger } = useRequest<any>('/api/swagger/search', { lazy: true });

  const [swaggerList, setSwaggerList] = useState<{ name: string; description: string; id: string }[]>([]);
  const [expandData, setExpandData] = useState<Record<string, any>>({});
  const [loadingId, setLoadingId] = useState(''); // 子列表loading
  const [expandCacheId, setExpandCache] = useState<string[]>([]); // 缓存已展开的列表id
  const [selectId, setSelectId] = useState<string[]>([]); // 已选中的api

  const listener = useEvent((ev: any) => {
    ev.preventDefault();
    // eslint-disable-next-line no-param-reassign
    ev.returnValue = `当前有打开的${title}，确认关闭吗？`;
    return false;
  });

  useEffect(() => {
    window.addEventListener('beforeunload', listener, true);
    return () => {
      window.removeEventListener('beforeunload', listener, true);
    };
  }, []);

  useEffect(() => {
    if (swaggerData && Array.isArray(swaggerData.tags)) {
      setSwaggerList(getTags(swaggerData));
      // setSwaggerList(swaggerData.tags.map((item: any) => ({ ...item, id: createId(8) })));
    } else {
      setSwaggerList([]);
    }
  }, [swaggerData]);

  useEffect(() => {
    if (tabsId) {
      const searchName = form.getFieldValue('name');
      setSelectId([]);
      if (!searchName) {
        requestSwagger({ id: tabsId });
      } else {
        onFinish({ name: searchName });
      }
    }
  }, []);

  // const onTabClick = (key: string) => {
  //   setTabsId(key);
  // };

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
    })
      .then((res: any) => {
        setLoadingId('');
        if (typeof res === 'object' && Object.keys(res || {}).length > 0) {
          const newData: any = {};
          Object.keys(res).forEach((key) => {
            const val = res[key];
            newData[key] = {
              description: val.description,
              methods: val.methods,
              request: val.request,
              response: val.response
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
      })
      .catch(() => {
        setLoadingId('');
      });
  };

  // 表单搜索
  const onFinish = (val: { name: string }) => {
    const { name } = val;

    requestSwagger({ id: tabsId, searchKeyword: name });

    return;
    if (name === undefined || name === '') {
      requestSwagger({ id: tabsId });
    } else {
      const id = createId(8);
      setSwaggerList([{ name, description: '', id }]);
      setExpandCache([id]);
      setLoadingId(id);
      // setSelectId([]);

      const reg = /[\u4e00-\u9fa5]+/g;
      const query = name.toLocaleUpperCase().startsWith('V') || reg.test(name) ? { searchTag: name } : { searchPath: name };

      requestSearchSwagger({
        configId: tabsId,
        ...query
      }).then((res: any) => {
        setLoadingId('');
        if (typeof res === 'object' && Object.keys(res || {}).length > 0) {
          const newData: any = {};
          Object.keys(res).forEach((key) => {
            const item = res[key];
            newData[key] = {
              description: item.description,
              methods: item.methods,
              request: item.request,
              response: item.response
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
      <Container title="Swagger">
        <Spin />
      </Container>
    );
  }

  if (error || !Array.isArray(data) || data.length === 0) {
    return <NoSwagger />;
  }

  const clearSelectId = (path?: string) => {
    if (path) {
      setSelectId(selectId.filter((p) => p !== path));
    } else {
      setSelectId([]);
    }
  };

  const onSwaggerApiClick = (res: any) => {
    history.push(`/doc${res.url}?tabsId=${tabsId}&searchTag=${res.item.name}`, { title: res.title });
  };

  const content = (
    <div className="popover-selected">
      <a onClick={() => clearSelectId()}>清空所有</a>
      {selectId &&
        selectId.map((path) => (
          <p key={path}>
            {path}{' '}
            <span onClick={() => clearSelectId(path)} title="移除">
              <CloseCircleOutlined />
            </span>
          </p>
        ))}
    </div>
  );

  const title = swaggerData?.info?.title || '-';

  const onEnterExport = (selectNode: any) => {
    if (selectId.length <= 0) {
      message.warn('请选择需要导出的api');
      return Promise.reject();
    }
    if (selectNode && selectId.length > 0) {
      const { dirPath } = selectNode;
      return requestSwaggerBuild({
        outputPath: dirPath,
        searchContent: selectId,
        configId: tabsId
      }).then((res) => {
        message.success('导出文档成功~');
        setSelectId([]);
        return Promise.resolve(true);
      });
    }
    return Promise.reject();
  };

  return (
    <Container isMain title={title} className="ui-swagger-container">
      <div className="swagger-main-content">
        {loadingSwagger && (
          <div className="fetch-loading">
            <Spin />
          </div>
        )}

        <div className="selected flex align-items">
          <Search form={form} onFinish={onFinish} />

          <div className="mlm10">
            <Button
              type="primary"
              danger
              icon={<ExportOutlined />}
              disabled={selectId.length === 0}
              onClick={() => {
                dirsRef.current?.show();
              }}
            >
              导出文档
            </Button>
          </div>

          <Popover content={content} title="已选中" placement="bottom">
            <div className="plp2">
              已选中<span className="span">{selectId.length}</span>个
            </div>
          </Popover>
        </div>

        <div className="body-flex">
          <SwaggerList
            tabsId={tabsId}
            selectId={selectId}
            setSelectId={setSelectId}
            swaggerList={swaggerList}
            loadingId={loadingId}
            expandCacheId={expandCacheId}
            expandData={expandData}
            onClickSwaggerHead={onClickSwaggerHead}
            onSwaggerApiClick={onSwaggerApiClick}
            searchKeyword={form.getFieldValue('name')}
          />
          {/* <ProjectDirs selectId={selectId} setSelectId={setSelectId} configId={tabsId} /> */}

          <DrawerDirs onOk={onEnterExport} ref={dirsRef} />
        </div>
      </div>
    </Container>
  );
});
