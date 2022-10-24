import React, { memo, useEffect, useState, useRef } from 'react';
import qs from 'qs';
import copy from 'copy-to-clipboard';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { CopyOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';
import { toResponseJSON } from '@src/utils';
import { Tabs, Spin, Table, Popover, Input, message, Button, Space } from 'antd';
import { useRequest } from '@src/hook';
import { isValidField } from '@src/utils';
import Container from '../Container';
import Code from '../../Components/Code';
import DrawerExport from './Components/DrawerExport';
// import SwaggerList from './Components/SwaggerList';
// import ProjectDirs from './Components/ProjectDirs';
// import getTags from './getTags';

import './less/detail.less';

const ApiInfo = (props: { api: any; title: string; url: string; tabsId: string; searchTag: string; onExport: () => void }) => {
  const { api = {}, url, onExport, tabsId, searchTag, title } = props;
  const history = useHistory();

  return (
    <div className="api-info-content">
      <Space style={{ marginBottom: 20 }}>
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => {
            history.push(`/editor${url}?tabsId=${tabsId}&searchTag=${searchTag}`, { title: `<edit>${title}` });
          }}
        >
          编辑器
        </Button>

        <Button icon={<ExportOutlined />} type="primary" danger onClick={onExport}>
          导出文档
        </Button>
      </Space>

      <div className="api-info-field">
        <b>接口地址：</b> <span className="text">{url} </span>{' '}
        <span
          className="cur"
          onClick={() => {
            copy(url);
            message.success('复制成功');
          }}
        >
          <CopyOutlined />
        </span>
      </div>
      <div className="api-info-field">
        <b>请求方式：</b> <span className="text">{api.methods?.toUpperCase()}</span>
      </div>
      <div className="api-info-field">
        <b>接口描述：</b> <span className="text">{api.description}</span>
      </div>

      {/* <div className='api-info-fixed-right'>
        
      </div> */}
    </div>
  );
};

const ApiTable = (props: any) => {
  const { showRequired } = props;
  const tableData: any[] = [];

  function getType(item: any) {
    if (item.type === 'array' && item.items && item.items.type) {
      return `array[${item.items.type}]`;
    }
    if (item.isArray) {
      return 'array[]';
    }
    return item.type;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const deep = (data: any, tableData: any[], index: number) => {
    if (typeof data !== 'object' || !data) return;
    Object.keys(data).forEach((v, i) => {
      const item = data[v];
      const is = isValidField(item);
      const children: any = is ? [] : null;
      const row = {
        key: `${index}/${i}/${v}`,
        name: v,
        ...item,
        required: item.required ? 'true' : 'false',
        type: getType(item),
        children
      };
      if (Array.isArray(tableData) && v !== 'isArray') {
        tableData.push(row);
      }
      if (is && item && typeof item === 'object') {
        deep(item, children, index + 1);
      }
    });
  };
  deep(props?.data, tableData, 1);

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      render: (text: string) => {
        return (
          <p
            className="cur table-field-name"
            onClick={() => {
              copy(text);
              message.success('复制成功');
            }}
          >
            {text}
          </p>
        );
      }
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

  if (tableData.length === 0) {
    return <div>无</div>;
  }

  return (
    <Table columns={columns} dataSource={tableData} rowKey="key" size="small" bordered pagination={false} defaultExpandAllRows={true} />
  );
};

export default memo(() => {
  const { location } = useHistory();
  const exportRef = useRef<any>();
  const pathname = location.pathname.replace(/^\/doc/, '');

  const [tabsId, setTabsId] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<SwaggerApi.Result | undefined>();
  const locationQuery: any = qs.parse(location.search.startsWith('?') ? location.search.substring(1) : '');
  const { request: requestSearchSwagger } = useRequest<any>('/api/swagger/search', { lazy: true });

  useEffect(() => {
    const query: any = qs.parse(location.search.startsWith('?') ? location.search.substring(1) : '');
    if (query && query.tabsId) {
      setTabsId(query.tabsId);
      requestSearchSwagger({
        configId: query.tabsId,
        searchTag: query.searchTag
      }).then((res: any) => {
        if (res && res[pathname]) {
          setError('');
          setData(res[pathname]);
        } else {
          setError(`${pathname} ，该接口无数据！`);
        }
      });
    }
  }, [location]);

  const onExport = () => {
    exportRef.current?.show();
  };

  if (error) {
    return (
      <Container isMain title="" className="ui-swagger-detail-container">
        <h3>{error}</h3>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container isMain title="" className="ui-swagger-detail-container">
        <Spin />
      </Container>
    );
  }

  return (
    <Container isMain title="" className="ui-swagger-detail-container">
      <ApiInfo url={pathname} tabsId={tabsId} title={data.description} api={data} onExport={onExport} searchTag={locationQuery.searchTag} />

      <h3 className="mtm20">请求示例：</h3>
      <Code code={data && toResponseJSON(data.request, { resultValueType: 'type' })} />
      <h3 className="mtm20">请求参数：</h3>
      <ApiTable data={data.request} showRequired />

      <h3 className="mtm40">响应参数：</h3>
      <ApiTable data={data.response} />
      <h3 className="mtm20">响应示例：</h3>
      <Code code={data && toResponseJSON(data.response, { resultValueType: 'desc' })} />

      <DrawerExport ref={exportRef} tabsId={tabsId} url={pathname} methods={data.methods} description={data.description} />
    </Container>
  );
});
