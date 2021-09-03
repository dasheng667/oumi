import React, { useState, useEffect, memo } from 'react';
import { DeleteOutlined, AimOutlined, FormOutlined } from '@ant-design/icons';
import { List, Button, Space, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { createId } from '@src/utils';
import { assertSelect, assertObject } from '../utils';
import { useDegContext } from '../context';

import type { IRequestPostItem } from '../type';

// const { Panel } = Collapse;
const { Option } = Select;

const AssertModal = memo((props: any) => {
  const { visible, setVisible, callback, editData, title } = props;
  const [form] = Form.useForm();
  // const [selectValue, setSelectValue] = useState('eq');
  // const [flag, setFlag] = useState(true);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({ ...editData });
    } else {
      form.resetFields();
    }
  }, [form, editData]);

  const runCancel = () => {
    setVisible(false);
  };

  const runOk = () => {
    form.submit();
    form.validateFields().then((val) => {
      // console.log('val', val);
      if (typeof callback === 'function') {
        callback({ ...val });
      }
      runCancel();
      form.resetFields();
    });
  };

  const initialValues = {
    type: 'assert',
    assertObject: '1',
    assertEnumKey: 'eq'
  };

  return (
    <Modal title={'添加断言'} visible={visible} onCancel={runCancel} onOk={runOk} okText="确定" cancelText="取消">
      <Form name="form_config" form={form} labelCol={{ span: 5 }} initialValues={initialValues}>
        <Form.Item name="key" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="type" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="断言名称">
          <Input />
        </Form.Item>
        <Form.Item name="assertObject" label="断言对象">
          <Select disabled>
            {assertObject.map((v) => (
              <Option key={v.value} value={v.value}>
                {v.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="expression" label="提取表达式" rules={[{ required: true, message: '表达式必填' }]}>
          <Input placeholder="JSON path表达式，如$.data.list[0].name" />
        </Form.Item>
        <div className="flex assert-flex">
          <Form.Item name="assertEnumKey" label="断言">
            <Select>
              {assertSelect.map((v) => (
                <Option key={v.value} value={v.value}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assertValue" label="">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
});

// const genExtra = ({ item, confirm }: { item: IRequestPostItem; confirm: (item: IRequestPostItem) => void }) => (
//   <Popconfirm title="确定要删除吗?" onConfirm={() => confirm(item)} okText="Yes" cancelText="No">
//     <DeleteOutlined
//       onClick={(event) => {
//         event.stopPropagation();
//       }}
//     />
//   </Popconfirm>
// );

interface Props {}

export default memo((props: Props) => {
  const { requestPostData, setRequestPostData } = useDegContext();
  const [assertVisible, setAssertVisible] = useState(false);
  const [editData, setEditData] = useState<IRequestPostItem | null>(null);
  const [list, setList] = useState<IRequestPostItem[]>([]);

  useEffect(() => {
    setList(requestPostData);
  }, [requestPostData]);

  const onModalCallback = (val: any) => {
    let nList: IRequestPostItem[] = [];
    if (val.key) {
      const findIndex = list.findIndex((v) => v.key === val.key);
      if (findIndex > -1) {
        list.splice(findIndex, 1, val);
        nList = [...list];
      }
    } else {
      const newP: IRequestPostItem = {
        ...val,
        key: createId()
      };
      nList = [...list, newP];
    }
    // setList(nList);
    setRequestPostData(nList);
  };

  const onConfirmDelete = (item: IRequestPostItem) => {
    setRequestPostData(list.filter((v) => v.key !== item.key));
  };

  const onEdit = (item: IRequestPostItem) => {
    setAssertVisible(true);
    setEditData(item);
  };

  const getFullTitle = (item: IRequestPostItem) => {
    const { name, type, assertEnumKey, expression, assertValue } = item;
    const find = assertSelect.find((v) => v.value === assertEnumKey);
    const fName = find ? find.name : '';
    const typeName = type === 'assert' ? '断言' : '';
    return (
      <span>
        <span className="type prp10">{typeName}</span>
        {name && <span>{name}</span>}
        {!name && (
          <span>
            {expression} {fName} {assertValue}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="request-content-front">
      <Space className="mbm10">
        <Button
          type="primary"
          onClick={() => {
            setEditData(null);
            setAssertVisible(true);
          }}
        >
          添加断言
        </Button>
        {/* <Button type='primary' >提取变量</Button> */}
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={list}
        className="assert-list"
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div className="flex-sp">
                  <div>
                    <span className="icon">
                      <AimOutlined />
                    </span>{' '}
                    <span>{getFullTitle(item)}</span>
                  </div>
                  <div className="heandler">
                    <Space>
                      <FormOutlined className="cur" onClick={() => onEdit(item)} />

                      <Popconfirm
                        title="确定要删除吗?"
                        onConfirm={() => onConfirmDelete(item)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          className="cur"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {/* <List size="large" bordered dataSource={list} renderItem={(item) => <List.Item>{item.title}</List.Item>} /> */}
      {/* <List>
        {list &&
          list.map((item) => {
            const { title, key } = item;
            return (
              <Panel header={title} key={key} extra={genExtra({ item, confirm: confirmDelete })}>
                <p>{text}</p>
              </Panel>
            );
          })}
      </List> */}
      <AssertModal
        visible={assertVisible}
        setVisible={setAssertVisible}
        editData={editData}
        callback={onModalCallback}
      />
    </div>
  );
});
