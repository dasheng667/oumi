import React, { useState, useEffect } from 'react';
import { Spin, Tabs } from 'antd';
import type { ListItem, Blocks } from '../../../global';
import { useRequest } from '../../../hook';

const { TabPane } = Tabs;

type Props = {
  item: ListItem;
  addToProject: (block: Blocks) => void;
};

export default (props: Props) => {
  const { item, addToProject } = props;

  const [blockData, setBlockData] = useState<Record<string, Blocks[]>>({});
  const {
    data,
    loading,
    error,
    request: requestBlocks,
    source,
    setData
  } = useRequest<Blocks[]>('/api/block/getListFormGit', { lazy: true });

  const runRequestBlocks = () => {
    if (item && item.href) {
      // setData(blocksJSON.list as any);
      requestBlocks({ url: item.href, useBuiltJSON: true });
    }
  };

  useEffect(() => {
    runRequestBlocks();
    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    const blocks: any = {};
    data.forEach((dataItem) => {
      const { tags } = dataItem;
      tags.forEach((tag) => {
        if (blocks[tag]) {
          blocks[tag].push(dataItem);
        } else {
          blocks[tag] = [dataItem];
        }
      });
    });
    // console.log('blocks', blocks);
    setBlockData(blocks);
  }, [data]);

  if (loading) {
    return (
      <div className="loading-blocks">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-blocks">
        请求失败，<a>https://raw.githubusercontent.com</a>域名有波动，<a onClick={runRequestBlocks}>稍后重试</a>。
      </div>
    );
  }

  return (
    <div className="blocks-container">
      <Tabs type="card">
        {blockData &&
          Object.keys(blockData).map((tag) => {
            const children = blockData[tag];
            return (
              <TabPane forceRender={false} tab={tag} key={tag}>
                <div className="blocks-list">
                  {children &&
                    children.map((cItem) => {
                      return (
                        <div className="blocks-list__item" key={cItem.path}>
                          <div className="handler">
                            <span onClick={() => addToProject(cItem)}>添加到项目</span>
                          </div>
                          <div className="img">
                            <img src={cItem.img} alt="" />
                          </div>
                          <p>{cItem.name}</p>
                        </div>
                      );
                    })}
                </div>
              </TabPane>
            );
          })}
      </Tabs>
    </div>
  );
};
