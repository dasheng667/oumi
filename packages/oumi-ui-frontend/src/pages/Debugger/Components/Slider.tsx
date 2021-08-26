/* eslint-disable no-param-reassign */
import React, { memo, useState } from 'react';
import { SearchOutlined, CopyOutlined, DeleteOutlined, SmallDashOutlined } from '@ant-design/icons';
import { Select, Input, Tree, Menu, Dropdown } from 'antd';

const { Option } = Select;
const { DirectoryTree } = Tree;

interface ListNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: ListNode[];
}

const projectList = [
  { id: 1, name: 'OMS' },
  { id: 2, name: 'BOMS' }
];

const defTreeData = [
  {
    title: 'parent 0',
    key: '0-0',
    group: 1,
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true }
    ]
  },
  {
    title: 'parent 1',
    key: '0-1',
    group: 1,
    children: [
      {
        title: 'leaf 1-0 -adfasdfasfasfasd11111222f',
        key: '0-1-0',
        icon: () => <span className="method get-color">GET</span>,
        children: [
          { title: 'leaf 0-0', key: '11', isLeaf: true },
          { title: 'leaf 0-1', key: '22', isLeaf: true }
        ]
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        icon: () => <span className="method post-color">POST</span>,
        children: [
          { title: 'leaf 0-0', key: '33', isLeaf: true },
          { title: 'leaf 0-1', key: '44', isLeaf: true }
        ]
      },
      {
        title: 'leaf 1-3',
        key: '0-1-3',
        icon: () => <span className="method put-color">PUT</span>,
        children: [
          { title: 'leaf 0-0', key: '55', isLeaf: true },
          { title: 'leaf 0-1', key: '66', isLeaf: true }
        ]
      }
    ]
  }
];

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
          href="https://www.antgroup.com"
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
  const { node, addChildGroup } = props;
  const { group } = node;

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
              <span className="icons title-delete" title="删除">
                <DeleteOutlined />
              </span>
            </>
          );
        })()}
      </div>
    </div>
  );
});

export default () => {
  const [treeData, setTreeData] = useState<ListNode[]>(defTreeData);
  // const [expandedKeys, setExpandedKeys] = useState([]);
  const onSelect = (keys: React.Key[], info: any) => {
    console.log('Trigger Select', keys, info);
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

    const loop = (data: any, key: string, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          callback(data[i], i, data);
          return;
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

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

  return (
    <div className="debugger-slider">
      <div className="select-project">
        <span className="name">选择：</span>
        <Select style={{ width: 180 }} value={1}>
          {projectList &&
            projectList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
      <div className="search">
        <Input prefix={<SearchOutlined />} allowClear placeholder="搜索" />
      </div>
      <div className="api-list">
        <DirectoryTree
          defaultExpandAll
          onSelect={onSelect}
          treeData={treeData}
          allowDrop={allowDrop}
          // onRightClick={onRightClick}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          draggable={(node: any) => !node.isLeaf}
          titleRender={(node) => <Title node={node} addChildGroup={() => addChildGroup(node)} />}
        />
      </div>
    </div>
  );
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
