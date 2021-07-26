import React, { useEffect, useState } from 'react';
import { Tree, Button, message, Form, Input } from 'antd';
import request from '../../../request';
import { useRequest } from '../../../hook';
import Popconfirm from './Popconfirm';

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

type Props = {
  selectId: string[];
  configId: string;
};

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

export default (props: Props) => {
  const { selectId, configId } = props;
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectNode, setSelectNode] = useState<any>(null);
  const { data, loading, request: requestSwaggerBuild } = useRequest('/api/swagger/build', { lazy: true });

  const requestDirs = (params?: any) => {
    return request.post('/api/project/dirs', params) as Promise<DataNode[]>;
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
    const { isLeaf } = node;
    if (selected && !isLeaf) {
      setSelectNode(node);
    } else {
      setSelectNode(null);
    }
  };

  const onClickExport = () => {
    // console.log('selectNode', selectNode)
    // console.log('selectId', selectId)
    if (selectId.length <= 0) {
      message.warn('请选择需要导出的api');
    }
    if (selectNode && selectId.length > 0) {
      const { dirPath } = selectNode;
      requestSwaggerBuild({
        outputPath: dirPath,
        searchContent: selectId,
        configId
      }).then((res) => {
        message.success('生成文件成功~');
      });
    }
  };

  return (
    <div className="dirs">
      <div className="dirs-box">
        <div className="dirs-head">当前项目目录：</div>

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

        <Tree showLine showIcon loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
      </div>
      <div className="dirs-btn">
        <Button type="primary" disabled={!selectNode} onClick={onClickExport} loading={loading}>
          生成接口到目录
        </Button>
      </div>
    </div>
  );
};
