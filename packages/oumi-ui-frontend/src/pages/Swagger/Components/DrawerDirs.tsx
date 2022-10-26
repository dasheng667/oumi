import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Drawer, Tree, message, Space } from 'antd';
import request from '@src/request';
import { useRequest } from '@src/hook';

interface Props {
  onOk: (node: any) => Promise<boolean | undefined>;
}

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const { DirectoryTree } = Tree;

function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });
}

const App = (props: Props, ref: any) => {
  const { onOk } = props;
  const [visible, setVisible] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectNode, setSelectNode] = useState<any>(null);

  const showDrawer = () => {
    requestAndSetTree();
    setVisible(true);
  };

  const hiddenDrawer = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => {
    return {
      show: showDrawer,
      hide: hiddenDrawer
    };
  });

  const requestDirs = (params?: any) => {
    return request.post('/api/project/dirs', params) as Promise<DataNode[]>;
  };

  const requestAndSetTree = () => {
    requestDirs().then((res) => {
      setTreeData(res);
    });
  };

  const onSelect = (selectedKeys: React.Key[], e: any) => {
    const { selected, node } = e;
    const { isLeaf } = node;
    if (selected && !isLeaf) {
      setSelectNode(node);
    } else {
      setSelectNode(null);
    }
  };

  function onLoadData({ key, children, dirPath }: any) {
    // console.log('onLoadData', arguments[0]);
    return new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }
      requestDirs({ currentPath: dirPath }).then((res) => {
        if (Array.isArray(res)) {
          setTreeData((origin) => updateTreeData(origin, key, res));
        }
        resolve();
      });
    });
  }

  const onClose = () => {
    setVisible(false);
  };

  const onEnterExport = () => {
    if (!selectNode) {
      message.error('请选择一个目录');
      return;
    }
    if (typeof onOk === 'function') {
      onOk(selectNode).then((res: any) => {
        if (res === undefined || res) {
          setVisible(false);
        }
      });
    }
  };

  const renderFooter = (
    <div style={{ paddingLeft: 20 }}>
      <Space>
        <Button type="primary" danger onClick={onEnterExport}>
          确定
        </Button>
        <Button onClick={() => setVisible(false)}>取消</Button>
      </Space>
    </div>
  );

  return (
    <Drawer width={700} title="导出文档" placement="right" onClose={onClose} visible={visible} footer={renderFooter} destroyOnClose>
      <p>生成接口的规则在可以在配置中心自定义。</p>
      <DirectoryTree loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
    </Drawer>
  );
};

export default forwardRef(App);
