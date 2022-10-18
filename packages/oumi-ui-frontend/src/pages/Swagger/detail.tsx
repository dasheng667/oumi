import React, { memo, useEffect, useState } from 'react';
import qs from 'qs';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Tabs, Spin, Table, Popover, Input } from 'antd';
import { useRequest } from '@src/hook';
import Container from '../Container';
// import Search from './Components/Search';
// import SwaggerList from './Components/SwaggerList';
// import ProjectDirs from './Components/ProjectDirs';
// import getTags from './getTags';

import './less/detail.less';

const ApiInfo = (props: any) => {
  const { api = {}, url } = props;
  return (
    <div className="api-info-content">
      <div className="api-info-field">
        {' '}
        <b>接口地址：</b> {url}
      </div>
      <div className="api-info-field">
        {' '}
        <b>请求方式：</b> {api.methods?.toUpperCase()}
      </div>
      <div className="api-info-field">
        {' '}
        <b>接口描述：</b> {api.description}
      </div>
    </div>
  );
};

// 判断是否是有效字段，因为swagger的数据也是json。response也是json
const isValidField = (data: any) => {
  if (typeof data.type === 'string') {
    if (Object.keys(data).length === 1) return false;
    if (data.format || data.example || data.description) {
      return false;
    }
  }
  return true;
};

const ApiTable = (props: any) => {
  const { showRequired } = props;
  const tableData: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const deep = (data: any, tableData: any[], index: number) => {
    Object.keys(data).forEach((v, i) => {
      const { isArray } = data;
      const item = data[v];
      const is = isValidField(item);
      const children: any = is ? [] : null;
      const row = {
        key: `${index}/${i}/${v}`,
        name: v,
        ...item,
        required: item.required ? 'true' : 'false',
        type: item.isArray ? 'array[]' : item.type,
        children
      };
      if (Array.isArray(tableData) && v !== 'isArray') {
        tableData.push(row);
      }
      if (is && typeof item === 'object') {
        deep(item, children, index + 1);
      }
    });
  };
  deep(props.data, tableData, 1);

  console.log('tableData:', tableData);

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '参数说明',
      dataIndex: 'description',
      key: 'description'
    },
    showRequired && {
      title: '是否必须',
      dataIndex: 'required',
      key: 'required'
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'example',
      dataIndex: 'example',
      key: 'example'
    }
  ].filter((v) => !!v);

  return (
    <Table columns={columns} dataSource={tableData} rowKey="key" size="small" bordered pagination={false} defaultExpandAllRows={true} />
  );
};

export default () => {
  const { location } = useHistory();
  const pathname = location.pathname.replace(/^\/swagger/, '');
  const query = qs.parse(location.search.startsWith('?') ? location.search.substring(1) : '');
  const [data, setData] = useState<any>(null);

  console.log('data:', data);

  const { request: requestSearchSwagger } = useRequest<any>('/api/swagger/search', { lazy: true });

  useEffect(() => {
    requestSearchSwagger({
      configId: query.tabsId,
      searchTag: query.searchTag
    }).then((res: any) => {
      if (res && res[pathname]) {
        setData(res[pathname]);
      }
    });
  }, []);

  if (!data) {
    return (
      <Container isMain title="" className="ui-swagger-detail-container">
        <Spin />
      </Container>
    );
  }

  return (
    <Container isMain title="" className="ui-swagger-detail-container">
      <ApiInfo url={pathname} api={data} />

      <h3 className="mtm20">请求参数：</h3>
      <ApiTable data={data.request} showRequired />

      <h3 className="mtm20">响应参数：</h3>
      <ApiTable data={data.response} />
    </Container>
  );
};
