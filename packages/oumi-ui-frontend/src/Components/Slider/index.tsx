import React, { memo, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { HomeFilled, MailOutlined } from '@ant-design/icons';
import type { ListItem } from '@src/global';
import { useRequest } from '@src/hook';
import { menuList } from '@src/router';

import './index.less';

// type Props = {
//   goProjectList: () => void;
//   selectItem: ListItem;
// };

const projectListPath = '/project/select';

export default (props: any) => {
  const history = useHistory();
  const [current, setCurrent] = useState('');

  const {
    data,
    error: errorInit,
    request
  } = useRequest<ListItem>('/api/dashboard/init', { errorMsg: false, lazy: true });

  useEffect(() => {
    request();
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

  if (errorInit) {
    return (
      <div style={{ padding: 50 }}>
        <Link to={projectListPath}>选择项目</Link>
      </div>
    );
  }

  return (
    <div className="ui-slider">
      <header onClick={goProjectList}>
        <div className="icon" title="Oumi 项目过滤器">
          <HomeFilled style={{ fontSize: 18 }} />
        </div>
        <div className="project-name">{data && data.name}</div>
      </header>
      {/* <div className="select flex-center">
        <Select style={{ width: 180 }} value={selectItem.id}>
          {projectList &&
            projectList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div> */}
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
      <div className="contact-me">
        <a href="mailto:345263463@qq.com">
          <MailOutlined /> 向我反馈
        </a>
      </div>
    </div>
  );
};
