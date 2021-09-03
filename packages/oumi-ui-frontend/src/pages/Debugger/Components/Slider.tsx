/* eslint-disable no-param-reassign */
import React, { memo, useState, useEffect } from 'react';
import {
  SearchOutlined,
  CopyOutlined,
  DeleteOutlined,
  SmallDashOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  BugOutlined
} from '@ant-design/icons';
import { Select, Input, Tree, Menu, Dropdown } from 'antd';
import { loop } from '@src/utils';
import type { TreeNode } from '../type';

const { Option } = Select;
const { DirectoryTree } = Tree;

const projectList = [
  { id: 1, name: 'OMS' },
  { id: 2, name: 'BOMS' }
];

const handlerTreeList = (list: any) => {
  if (!Array.isArray(list)) return [];
  const res = [...list];
  function deep(arr: any) {
    if (Array.isArray(arr)) {
      arr.forEach((item) => {
        if (item.isTest) {
          item.icon = () => <BugOutlined />;
        } else if (item.method) {
          item.icon = () => <span className={`method ${item.method}-color`}>{item.method.toLocaleUpperCase()}</span>;
        }
        if (item.children) {
          deep(item.children);
        }
      });
    }
  }
  deep(res);
  return res;
};

const TreeMenu = ({ addChildGroup }: any) => {
  const onClick = (e: any, callbcak: any) => {
    e.stopPropagation();
    e.preventDefault();
    callbcak();
  };

  return (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href=""
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <span onClick={(e) => onClick(e, addChildGroup)}>添加子分类</span>
      </Menu.Item>
    </Menu>
  );
};

const Title = memo((props: any) => {
  const { node, addChildGroup, removeItem, removeLoading } = props;
  const { group, key } = node;

  return (
    <div className="tree-title">
      <div className="title-name truncate">{node.title}</div>
      <div className="title-handler">
        {(() => {
          if (group) {
            return (
              <Dropdown overlay={<TreeMenu addChildGroup={addChildGroup} />} placement="bottomCenter" arrow>
                <SmallDashOutlined />
              </Dropdown>
            );
          }
          return (
            <>
              <span className="icons title-copy" title="复制">
                <CopyOutlined />
              </span>
              <span
                className="icons title-delete"
                title="删除"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(key);
                }}
              >
                {removeLoading ? <LoadingOutlined /> : <DeleteOutlined />}
              </span>
            </>
          );
        })()}
      </div>
    </div>
  );
});

export default ({
  addPane,
  list,
  removeItem,
  removeLoading,
  expandedKeys,
  onExpand
}: {
  addPane: (pane: any) => void;
  list: any[];
  removeItem: any;
  removeLoading: boolean;
  expandedKeys: string[];
  onExpand: any;
}) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const onSelect = (keys: React.Key[], info: any) => {
    // console.log('Trigger Select', keys, info);
    const { node } = info as { node: TreeNode };
    addPane({
      title: node.title,
      method: node.method,
      url: node.url,
      key: node.key,
      env: node.env,
      pkey: node.pkey,
      isTest: node.isTest
    });
  };

  const onDrop = (info: any) => {
    // console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (!info.dropToGap && !info.node.group) {
      return;
    }

    const data = [...treeData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any;
      let i: any;
      loop(data, dropKey, (item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else if (ar) {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
  };

  const allowDrop = ({ dropNode }: any) => {
    // console.log('dropNode', dropNode)
    if (dropNode.group) return true;
    if (dropNode.children && dropNode.children.length > 0) return true;
    return false;
  };

  const onDragEnter = (info: any) => {
    // console.log(info);
  };

  const addChildGroup = (node: any) => {
    // console.log('node', node)
    const res: any = {
      title: 'new parent1',
      key: Math.random(),
      group: 1
    };
    setTreeData((origin) => updateTreeData(origin, node.key, [...node.children, res]));
  };

  const onRightClick = ({ event, node }: any) => {
    console.log('xx', event, node);
  };

  useEffect(() => {
    setTreeData(handlerTreeList(list));
  }, [list]);

  return (
    <div className="debugger-slider">
      {/* <div className="select-project">
        <Select style={{ width: 180 }} value={1}>
          {projectList &&
            projectList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
        <span className="name">选择</span>
      </div> */}
      <div className="search">
        <Input prefix={<SearchOutlined />} allowClear placeholder="搜索" />
        <span
          className="add"
          onClick={() =>
            addPane({
              title: '新建接口',
              isNew: true
            })
          }
        >
          <PlusCircleOutlined />
        </span>
      </div>
      <div className="api-list">
        <DirectoryTree
          defaultExpandAll
          onSelect={onSelect}
          treeData={treeData}
          allowDrop={allowDrop}
          // expandedKeys={expandedKeys}
          // onRightClick={onRightClick}
          onExpand={onExpand}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          draggable={(node: any) => !node.isLeaf}
          titleRender={(node) => (
            <Title
              node={node}
              addChildGroup={() => addChildGroup(node)}
              removeItem={removeItem}
              removeLoading={removeLoading}
            />
          )}
        />
      </div>
    </div>
  );
};

function updateTreeData(list: TreeNode[], key: React.Key, children: TreeNode[]): TreeNode[] {
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
