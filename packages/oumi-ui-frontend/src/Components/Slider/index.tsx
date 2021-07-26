import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Select } from 'antd';
import { ShoppingOutlined, ApiOutlined, SettingOutlined } from '@ant-design/icons';
import type { ProjectListItem, IRouter } from '../../global';

import './index.less';

const { Option } = Select;

type Props = {
  goProjectList: () => void;
  // projectList: ProjectListItem[];
  selectItem: ProjectListItem;
};

export default (props: Props) => {
  const history = useHistory();
  const { goProjectList, selectItem } = props;

  const menuList = [
    {
      name: '模版',
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
      <header onClick={goProjectList}>Oumi UI 管理器</header>
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
    </div>
  );
};
