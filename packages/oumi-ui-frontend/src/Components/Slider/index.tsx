import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Select } from 'antd';
import { ShoppingOutlined, ApiOutlined, SettingOutlined, HomeFilled, MailOutlined } from '@ant-design/icons';
import type { ListItem, IRouter } from '../../global';

import './index.less';

const { Option } = Select;

type Props = {
  goProjectList: () => void;
  // projectList: ListItem[];
  selectItem: ListItem;
};

export default (props: Props) => {
  const history = useHistory();
  const { goProjectList, selectItem } = props;

  const menuList = [
    {
      name: '资产',
      path: '/dashboard',
      icon: <ShoppingOutlined />
    },
    {
      name: 'Swagger',
      path: '/dashboard/swagger',
      icon: <ApiOutlined />
    },
    {
      name: '配置',
      path: '/dashboard/config',
      icon: <SettingOutlined />
    }
  ];

  return (
    <div className="ui-slider">
      <header onClick={goProjectList}>
        <div className="icon" title="Oumi 项目过滤器">
          <HomeFilled style={{ fontSize: 18 }} />
        </div>
        <div className="project-name">{selectItem && selectItem.name}</div>
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
            <div
              className={`slider-list-item ${history.location.pathname === item.path ? 'active' : ''}`}
              key={item.path}
            >
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
          <MailOutlined /> 联系我
        </a>
      </div>
    </div>
  );
};
