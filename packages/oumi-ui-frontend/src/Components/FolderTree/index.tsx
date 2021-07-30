import React, { useEffect, useState } from 'react';
import { Tree, Button, message, Form, Input } from 'antd';
import type { EventDataNode, DataNode } from 'rc-tree/lib/interface';
import request from '../../request';
import Popconfirm from './Popconfirm';

interface ListNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: ListNode[];
}

type Props = {
  onSelect?: (node: any) => void;
};

export type SelectNode = EventDataNode & { dirPath: string };

export type SelectInfo = {
  event: 'select';
  selected: boolean;
  node: any;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
};

function updateTreeData(list: ListNode[], key: React.Key, children: ListNode[]): ListNode[] {
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

export default (props: Props) => {
  const { onSelect } = props;
  const [treeData, setTreeData] = useState<ListNode[]>([]);
  const [selectNode, setSelectNode] = useState<any>(null);

  const requestDirs = (params?: any) => {
    return request.post('/api/project/dirs', params) as Promise<ListNode[]>;
  };

  const requestAndSetTree = () => {
    requestDirs().then((res) => {
      setTreeData(res);
    });
  };

  useEffect(() => {
    requestAndSetTree();
  }, []);

  function onLoadData({ key, children, dirPath }: any) {
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

  const onTreeSelect = (selectedKeys: React.Key[], info: SelectInfo) => {
    const { selected, node } = info;
    const { isLeaf } = node;
    if (selected && !isLeaf) {
      setSelectNode(node);
    } else {
      setSelectNode(null);
    }
    if (onSelect && typeof onSelect === 'function') {
      onSelect(info);
    }
  };

  return (
    <div className="dirs">
      <div className="dirs-box">
        <Popconfirm
          selectNode={selectNode}
          onSuccess={() => {
            if (selectNode && selectNode.key) {
              onLoadData({ key: selectNode.key, dirPath: selectNode.key });
            } else {
              requestAndSetTree();
            }
          }}
        />

        <Tree showLine showIcon loadData={onLoadData} treeData={treeData} onSelect={onTreeSelect} />
      </div>
    </div>
  );
};
