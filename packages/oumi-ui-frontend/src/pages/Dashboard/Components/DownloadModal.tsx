import React, { useState } from 'react';
import { Modal, Alert, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { Blocks } from '../../../global';
import type { SelectInfo, SelectNode } from '../../../Components/FolderTree';
import FolderTree from '../../../Components/FolderTree';
import { useRequest } from '../../../hook';

type Props = {
  modalData: Blocks | null;
  setModalVisible: (flag: null) => void;
};

const App = (props: Props) => {
  const history = useHistory();
  const { modalData, setModalVisible } = props;
  const title = modalData && modalData.name ? `添加 - ${modalData?.name} ` : '添加到项目';
  const [selectNode, setSelectNode] = useState<SelectNode | null>(null);
  const { data, loading, request } = useRequest('/api/block/downloadFile', { lazy: true });

  const handleOk = () => {
    // console.log('selectNode', selectNode)
    if (!selectNode || !modalData) return;

    request({
      destPath: selectNode?.dirPath,
      url: modalData.url
    })
      .then((res) => {
        if (res) {
          message.success('下载文件完成');
        } else {
          message.error('下载文件异常');
        }
        setModalVisible(null);
      })
      .catch((e) => {
        // 下载限速
        message.destroy();
        if (e.code === 999) {
          Modal.confirm({
            title: '限速提示!',
            icon: <ExclamationCircleOutlined />,
            content: e.msg,
            onOk: () => {
              history.push('/dashboard/config?key=3');
            }
          });
        } else {
          message.error(e.msg || '请求超时，请重试~');
        }
      });
  };

  const handleCancel = () => {
    setModalVisible(null);
  };

  const onTreeSelect = (info: SelectInfo) => {
    const { selected, node } = info;
    const { isLeaf } = node;
    if (selected && !isLeaf) {
      setSelectNode(node);
    }
  };

  return (
    <>
      <Modal
        title={title}
        visible={!!modalData}
        style={{ top: 20 }}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !selectNode, loading }}
        okText="确认添加"
        cancelText="取消"
      >
        <Alert message="温馨提示：该功能会下载远程文件，请耐心等待！😀😀😀" type="warning" />
        <br />
        <FolderTree onSelect={onTreeSelect} />
      </Modal>
    </>
  );
};

export default App;
