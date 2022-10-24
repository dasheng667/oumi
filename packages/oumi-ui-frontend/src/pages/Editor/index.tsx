/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-inner-declarations */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { DndProvider, createDndContext } from 'react-dnd';
import { useHistory } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isValidField } from '@src/utils';
import { Spin, Cascader } from 'antd';
import qs from 'qs';
import { useRequest } from '@src/hook';
import Container from '../Container';
import Editor from './Editor';

import './index.less';

type IOption = {
  label: string;
  value: string;
  children?: IOption[];
};

type IFields = {
  key: string;
  fieldType: string;
  description: string;
};

const RNDContext = createDndContext(HTML5Backend);

function HOCDnD(props: any) {
  const manager = useRef(RNDContext);
  if (!manager.current || !manager.current.dragDropManager) {
    return <>{props.children}</>;
  }
  return <DndProvider manager={manager.current.dragDropManager}>{props.children}</DndProvider>;
}

const Common = (props: any) => {
  return (
    <React.Fragment>
      <HOCDnD>{props.children}</HOCDnD>
    </React.Fragment>
  );
};

const ApiInfo = (props: { api: any; url: string; options: IOption[]; onChange: (key: string) => void }) => {
  const { api = {}, url, options, onChange: propsChange } = props;
  const [key, setKey] = useState('');
  // const history = useHistory();

  const onChange = (_: any[], selectedOptions: any[]) => {
    const k = _[_.length - 1];
    setKey(k);
    propsChange(k);
  };

  return (
    <div className="api-info-content">
      <div className="api-info-field">
        <b>接口地址：</b> <span className="text">{url} </span>{' '}
      </div>
      {/* <div className="api-info-field">
        <b>请求方式：</b> <span className="text">{api.methods?.toUpperCase()}</span>
      </div> */}
      <div className="api-info-field">
        <b>接口描述：</b> <span className="text">{api.description}</span>
      </div>
      <div className="api-info-field">
        <b>选择数据源：</b>{' '}
        <Cascader changeOnSelect options={options} onChange={onChange}>
          <a href="#">{key || '选择数据'}</a>
        </Cascader>
      </div>
    </div>
  );
};

export default () => {
  const { location } = useHistory();
  const pathname = location.pathname.replace(/^\/editor/, '');
  const [tabsId, setTabsId] = useState('');
  const [error, setError] = useState('');
  const [fields, setFields] = useState<IFields[]>([]);
  const [data, setData] = useState<SwaggerApi.Result | undefined>();

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

  const options = useMemo(() => {
    const arr: IOption[] = [];
    if (data && data.response) {
      function deep(data: any, arr: any[], parentKey = '') {
        data &&
          typeof data === 'object' &&
          Object.keys(data).forEach((v) => {
            const item = data[v];
            const is = isValidField(item);
            const children: IOption[] | null = is ? [] : null;
            if (v !== 'isArray' && Array.isArray(arr)) {
              arr.push({
                label: v,
                value: `${parentKey}/${v}`,
                children
              });
            }
            if (is && children && v !== 'isArray') {
              deep(item, children, `${parentKey}/${v}`);
            }
          });
      }
      deep(data.response, arr);
    }
    return arr;
  }, [data]);

  const onChange = (key: string) => {
    if (data && data.response) {
      const k = key.split('/').filter((v) => v);
      let res = data.response;
      k.forEach((vk) => {
        if (res[vk]) {
          res = res[vk];
        }
      });
      const transFields = (json: any) => {
        const arr: any[] = [];
        if (json && typeof json === 'object' && isValidField(json)) {
          Object.keys(json).forEach((k) => {
            const item = json[k];
            if (k !== 'isArray') {
              arr.push({
                key: k,
                fieldType: item.format,
                description: item.description
              });
            }
          });
        }
        return arr;
      };
      // console.log("res:", res);
      const fields = transFields(res);
      setFields(fields);
    }
  };

  if (error) {
    return (
      <Common>
        <Container isMain title="">
          <h3>{error}</h3>
        </Container>
      </Common>
    );
  }

  if (!data) {
    return (
      <Common>
        <Container isMain title="">
          <Spin />
        </Container>
      </Common>
    );
  }

  return (
    <Common>
      <Container isMain title="" className="editor-detail-container">
        <ApiInfo api={data} url={pathname} options={options} onChange={onChange} />
        <Editor fields={fields} />
      </Container>
    </Common>
  );
};
