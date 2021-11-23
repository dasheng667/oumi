import React, { memo, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { HomeFilled, MailOutlined, CaretDownOutlined, StarOutlined, CodeOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Spin } from 'antd';
import { useRequest } from '@src/hook';
import { menuList } from '@src/router';
import type { ListItem } from '@src/typings/app';

import './index.less';

// type Props = {
//   goProjectList: () => void;
//   selectItem: ListItem;
// };

const projectListPath = '/project/select';

export default (props: any) => {
  const history = useHistory();
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);

  const { request: getProjectList, data: projectList = [] } = useRequest<ListItem[]>('/api/project/list');
  const { request: requestDefDashboard } = useRequest('/api/project/dashboard', { lazy: true });
  const { request: requestOpen } = useRequest('/api/openInEditor', { lazy: true });
  const { data, error: errorInit, request } = useRequest<ListItem>('/api/dashboard/init', { errorMsg: false, lazy: true });

  useEffect(() => {
    setLoading(true);
    request()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorInit) {
      history.replace(projectListPath);
    }
  }, [errorInit]);

  useEffect(() => {
    const { location } = history;
    let path = location.pathname;
    if (path.startsWith('/tasks')) {
      path = '/tasks';
    }
    setCurrent(path);
  }, [history, history.location]);

  const goProjectList = () => {
    history.push(projectListPath);
  };

  const goDashboard = (item: ListItem) => {
    requestDefDashboard({ id: item.id }).then(() => {
      window.location.reload();
    });
  };

  const onClickOpen = async () => {
    if (!data) return;
    setLoading(true);
    try {
      await requestOpen({ input: { file: data.path } });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const menu = () => {
    return (
      <Menu>
        <Menu.Item key="3" onClick={goProjectList}>
          <HomeFilled /> Oumi 管理器
        </Menu.Item>
        <Menu.Item key="1" onClick={onClickOpen}>
          <CodeOutlined /> 在编辑器中打开
        </Menu.Item>
        <Menu.Divider />
        <Menu.ItemGroup title="收藏的项目">
          {projectList &&
            projectList
              .filter((v) => !!v.collection && data && v.id !== data.id)
              .map((item) => (
                <Menu.Item key={item.id} onClick={() => goDashboard(item)}>
                  {' '}
                  <StarOutlined /> {item.name}{' '}
                </Menu.Item>
              ))}
        </Menu.ItemGroup>
      </Menu>
    );
  };

  if (!data) {
    return null;
  }

  if (errorInit) {
    return (
      <div style={{ padding: 50 }}>
        <Link to={projectListPath}>选择项目</Link>
      </div>
    );
  }

  return (
    <div className="ui-slider">
      <header>
        <Dropdown arrow placement="bottomCenter" overlay={menu} trigger={['click']}>
          <div className="search">
            {data.name}
            {loading ? <Spin size="small" /> : <CaretDownOutlined />}
          </div>
        </Dropdown>
      </header>
      <div className="slider-list">
        {menuList.map((item) => {
          return (
            <div className={`slider-list-item ${current === item.path ? 'active' : ''}`} key={item.path}>
              <Link to={item.path}>
                {item.icon}
                {item.name}
              </Link>
            </div>
          );
        })}
      </div>
      <div className="contact-me"></div>
    </div>
  );
};
