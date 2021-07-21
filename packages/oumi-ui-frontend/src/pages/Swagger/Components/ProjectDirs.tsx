import React, { useEffect, useState } from 'react';
import { Tree, Button } from 'antd';
import request from '../../../request';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

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

export default (props: any) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [isExport, setIsExport] = useState(true);

  const requestDirs = (params?: any) => {
    return request.post('/api/project/dirs', params) as Promise<DataNode[]>;
  };

  useEffect(() => {
    requestDirs().then((res) => {
      setTreeData(res);
    });
  }, []);

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

  const onSelect = (selectedKeys: React.Key[], e: any) => {
    const { selected, node } = e;
    const { dirPath, isLeaf } = node;
    if (selected && !isLeaf) {
      setIsExport(false);
    }
  };

  const onClickExport = () => {};

  return (
    <div className="dirs">
      <div className="dirs-box">
        <p>当前项目目录：</p>
        <Tree showLine showIcon loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
      </div>
      <div className="dirs-btn">
        <Button type="primary" disabled={isExport} onClick={onClickExport}>
          生成接口到目录
        </Button>
      </div>
    </div>
  );
};
