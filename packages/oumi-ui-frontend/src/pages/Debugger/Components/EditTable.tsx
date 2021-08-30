import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Space } from 'antd';
import type { FormInstance } from 'antd/lib/form';
// import { DeleteOutlined } from '@ant-design/icons';

const Textarea = Input.TextArea;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(true);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && inputRef.current) {
      // inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    // setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      // toggleEdit();
      const data = { ...record, ...values };
      form.setFieldsValue(data);
      handleSave(data);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record[dataIndex]}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title} is required.`,
        //   },
        // ]}
      >
        {/* <Input /> */}
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0] & {
  tableTitle?: string;
  onChange?: (data: any) => void;
};

interface DataType {
  key: React.Key;
  name: string;
  value: string;
  remark: string;
}

interface EditableTableState {
  toggle: boolean;
  dataSource: DataType[];
  count: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export default class EditableTable extends React.Component<EditableTableProps, EditableTableState> {
  columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

  constructor(props: EditableTableProps) {
    super(props);

    this.columns = [
      {
        title: '参数名',
        dataIndex: 'name',
        width: '30%',
        editable: true
      },
      {
        title: '参数值',
        dataIndex: 'value',
        editable: true
      },
      {
        title: '说明',
        dataIndex: 'remark',
        editable: true
      },
      {
        title: '处理',
        dataIndex: 'operation',
        width: 200,
        render: (_, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      toggle: false,
      dataSource: [
        {
          key: '0',
          name: '',
          value: '',
          remark: ''
        }
      ],
      count: 2
    };
  }

  handleDelete = (key: React.Key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData: DataType = {
      key: count,
      name: ``,
      value: '',
      remark: ``
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleSave = (row: DataType) => {
    const { onChange } = this.props;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
    if (typeof onChange === 'function') {
      onChange(newData);
    }
  };

  render() {
    const { tableTitle } = this.props;
    const { dataSource, toggle } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div className="">
        <div className="table-title mbm10">{tableTitle}</div>
        <div className="flex rel">
          <div className="rel table-pad flex-1">
            {!toggle && (
              <Table
                size="small"
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                pagination={false}
              />
            )}
            {toggle && (
              <div className="table-textarea">
                <div className="t-header flex-sp">
                  <p>格式：参数名,必填,示例值,说明</p>
                  <div className="t-handler">
                    <Space>
                      <Button size="small" type="primary">
                        确定
                      </Button>
                      <Button size="small" onClick={() => this.setState({ toggle: false })}>
                        取消
                      </Button>
                    </Space>
                  </div>
                </div>
                <Textarea></Textarea>
                <div className="t-header flex-sp">
                  <span className="gray-color">字段之间以英文逗号(,)分隔，多条记录以换行分隔</span>
                </div>
              </div>
            )}
          </div>
          <div className="table-row-btn">
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
              新增一行
            </Button>
          </div>
          <div className="table-textarea-toggle" onClick={() => this.setState({ toggle: !this.state.toggle })}>
            批量修改
          </div>
        </div>
      </div>
    );
  }
}