import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Tabs, Form, Input, message } from 'antd';
import EditTable from './EditTable';
import { useRequest } from '@src/hook';
import type { IRequestData, EditTableItem, IRequestDataKey } from '../type';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

type CKEY = 'e1' | 'e2' | 'e3' | 'g1' | 'g2';
type EnvType = 'envList' | 'var' | 'params';

type IOnChange = (data: any, type: EnvType) => void;

const { TabPane } = Tabs;

const Tips = () => {
  return <div className="tips">温馨提示：每次保存仅限当前选项卡的内容！</div>;
};

const title: any = {
  e1: '开发环境',
  e2: '测试环境',
  e3: '生产环境'
};

const envVal: any = {
  e1: 'dev',
  e2: 'test',
  e3: 'prod'
};

const MainEnv = memo(
  ({ form, ckey, onChange, envList }: { form: any; ckey: CKEY; onChange: IOnChange; envList: any[] }) => {
    const [tableData, setTableData] = useState<any>({
      dev: [],
      test: [],
      prod: []
    });

    const onTableChange = (data: EditTableItem[]) => {
      const env = envVal[ckey];
      const newData = { ...tableData, [env]: data };
      setTableData(newData);
      onChange(data, 'envList');
    };

    useEffect(() => {
      const env = envVal[ckey];
      const defaultForm = { name: title[ckey], env, url: '' };
      if (Array.isArray(envList)) {
        const find = envList.find((v) => v.envName === env);
        if (find) {
          setTableData({ ...tableData, [env]: find.data });
          if (find.form) {
            form.setFieldsValue({ ...find.form });
            return;
          }
        }
      }
      form.setFieldsValue(defaultForm);
    }, [form, ckey]);

    return (
      <>
        <Form name={`${form}_${ckey}`} form={form} labelCol={{ span: 3 }} initialValues={{ url: 'http: 127.0.0.1' }}>
          <Form.Item name="name" label="环境名称" rules={[{ required: true, message: '请输入环境名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="前置URL">
            <Input />
          </Form.Item>
          <Form.Item name="env" hidden>
            <Input />
          </Form.Item>
        </Form>
        <div className="title">环境变量</div>
        <EditTable tableData={tableData[envVal[ckey]]} size="small" onEditChange={(data) => onTableChange(data)} />
        <Tips />
      </>
    );
  }
);

const MainContent = memo(
  ({ ckey, onChange, form, globalData }: { ckey: CKEY; onChange: IOnChange; form: any; globalData: any }) => {
    const [tabFlag, setTabFlag] = useState(false);
    const [tabsKey, setTabsKey] = useState('1');
    const [varTableData, setVarTableData] = useState<any>([]);
    const [request, setRequestData] = useState<IRequestData>({
      query: [],
      header: [],
      cookie: [],
      bodyFormData: [],
      bodyJSON: []
    });

    const { global, envList } = globalData || {};

    useEffect(() => {
      if (!Array.isArray(global)) return;
      const find = global.find((v: any) => v.type === 'params');
      if (find) {
        setRequestData(find.data);
      }

      const findV = global.find((v: any) => v.type === 'var');
      if (findV) {
        setVarTableData(findV.data);
      }
    }, [globalData, global]);

    // 跳转对应的tab
    useEffect(() => {
      if (request && tabFlag === false) {
        if (request.bodyFormData && Object.keys(request.bodyFormData).length > 0) {
          setTabsKey('2');
        } else if (request.bodyJSON && Object.keys(request.bodyJSON).length > 0) {
          setTabsKey('2');
        } else if (request.query && request.query.length > 0) {
          setTabsKey('1');
        } else if (request.header && request.header.length > 0) {
          setTabsKey('3');
        }
        setTabFlag(true);
      }
    }, [request, tabFlag]);

    const onVarTableChange = (data: EditTableItem[], key: EnvType) => {
      setVarTableData(data);
      onChange(data, key);
    };

    const onTableChange = (key: IRequestDataKey, data: EditTableItem[]) => {
      const newData = { ...request, [key]: data };
      setRequestData(newData);
      onChange(newData, 'params');
    };

    if (ckey === 'g1') {
      return (
        <>
          <div className="title">全局变量</div>
          <EditTable tableData={varTableData} size="small" onEditChange={(data) => onVarTableChange(data, 'var')} />
          <Tips />
        </>
      );
    }

    if (ckey === 'g2') {
      return (
        <>
          <div className="title">全局参数</div>
          <Tabs activeKey={tabsKey} onChange={(key) => setTabsKey(key)}>
            <TabPane tab="Params" key="1">
              <EditTable
                size="small"
                tableData={request.query}
                tableTitle="Query参数"
                onEditChange={(data) => onTableChange('query', data)}
              />
            </TabPane>
            <TabPane tab="Body" key="2">
              <EditTable
                size="small"
                tableData={request.bodyFormData}
                onEditChange={(data) => onTableChange('bodyFormData', data)}
              />
            </TabPane>
            <TabPane tab="Header" key="3">
              <EditTable
                size="small"
                tableData={request.header}
                onEditChange={(data) => onTableChange('header', data)}
              />
            </TabPane>
            <TabPane tab="Cookie" key="4">
              <EditTable
                size="small"
                tableData={request.cookie}
                onEditChange={(data) => onTableChange('cookie', data)}
              />
            </TabPane>
          </Tabs>
          <Tips />
        </>
      );
    }

    return <MainEnv form={form} ckey={ckey} onChange={onChange} envList={envList} />;
  }
);

export default (props: Props) => {
  const { visible, setVisible } = props;
  const [ckey, setKey] = useState<CKEY>('e1');
  const [content, setContent] = useState({ type: '', data: null });
  const { request: requestGet, data: globalData = {} } = useRequest('/api/debugger/getGlobalVar', { lazy: true });
  const { request: requestSave, loading: loadingSave } = useRequest('/api/debugger/saveGlobalVar', { lazy: true });

  useEffect(() => {
    if (visible === true) {
      requestGet();
    }
  }, [visible]);

  const [form] = Form.useForm();

  const toggleContent = (pkey: CKEY) => {
    setKey(pkey);
  };

  const runCancel = () => {
    setVisible(false);
  };

  const onChange = (data: any, type: EnvType) => {
    setContent({ data, type });
  };

  const runOk = () => {
    const { type, data } = content;
    const requestParams: any = {
      type,
      data
    };
    // 环境变量
    if (ckey.substr(0, 1) === 'e') {
      form.submit();
      form.validateFields().then((res) => {
        requestParams.form = res;
        requestSave(requestParams).then(() => {
          message.success('保存成功');
          runCancel();
        });
      });
    } else {
      requestSave(requestParams).then(() => {
        message.success('保存成功');
        runCancel();
      });
    }
  };

  return (
    <Modal
      title="变量配置"
      width={1000}
      visible={visible}
      onCancel={runCancel}
      onOk={runOk}
      okText="保存"
      cancelText="取消"
      okButtonProps={{ loading: loadingSave }}
    >
      <div className="modal-env">
        <div className="env-slider">
          <div className="title">全局</div>
          <div className="env-list">
            <div className={`env-list__item ${ckey === 'g1' ? 'active' : ''}`} onClick={() => toggleContent('g1')}>
              <span className="name">全局变量</span>
            </div>
            <div className={`env-list__item ${ckey === 'g2' ? 'active' : ''}`} onClick={() => toggleContent('g2')}>
              <span className="name">全局参数</span>
            </div>
          </div>

          <div className="title">环境</div>
          <div className="env-list">
            <div className={`env-list__item ${ckey === 'e1' ? 'active' : ''}`} onClick={() => toggleContent('e1')}>
              <span className="name">开发环境</span>
            </div>
            <div className={`env-list__item ${ckey === 'e2' ? 'active' : ''}`} onClick={() => toggleContent('e2')}>
              <span className="name">测试环境</span>
            </div>
            <div className={`env-list__item ${ckey === 'e3' ? 'active' : ''}`} onClick={() => toggleContent('e3')}>
              <span className="name">生产环境</span>
            </div>
          </div>
        </div>
        <div className="env-content">
          <MainContent ckey={ckey} onChange={onChange} form={form} globalData={globalData} />
        </div>
      </div>
    </Modal>
  );
};
