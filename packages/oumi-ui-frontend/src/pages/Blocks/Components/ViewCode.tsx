import React, { useEffect, useState } from 'react';
import { Drawer, Spin } from 'antd';
import type { Blocks, ListItem } from '@src/typings/app';
import { useRequest } from '@src/hook';
import Code from '@src/Components/Code';

type Props = {
  currentTab: ListItem | null;
  modalData: Blocks | null;
  setModalVisible: (flag: null) => void;
};

export default (props: Props) => {
  const { modalData, setModalVisible, currentTab } = props;
  const { data, loading, request, error } = useRequest('/api/block/getFileContent', { lazy: true });
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!modalData) return;
    request({
      projectId: currentTab?.projectId,
      source: currentTab?.source,
      url: modalData?.url,
      path: modalData?.path
    }).then((res: any) => {
      setCode(res);
    });
  }, [modalData]);

  const onClose = () => {
    setModalVisible(null);
  };

  const renderContent = () => {
    if (loading) return <Spin />;
    if (error) return <span>接口异常</span>;
    if (code) return <Code code={code} lang="jsx" isCopy />;
    return null;
  };

  return (
    <Drawer title="代码预览" visible={!!modalData} onClose={onClose} width={900}>
      {renderContent()}
    </Drawer>
  );
};
