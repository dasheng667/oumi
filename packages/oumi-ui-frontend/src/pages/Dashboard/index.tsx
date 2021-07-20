import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Spin, Select } from 'antd';
import { useRequest } from '../../hook';
import type { ProjectListItem } from '../../global';

import './index.less';

const { Option } = Select;
const projectListPath = '/project/select';

export default () => {
  const history = useHistory();
  const { data, error, loading } = useRequest<ProjectListItem>('/api/dashboard/get');
  const { data: projectList = [] } = useRequest<ProjectListItem[]>('/api/project/list');

  const goProjectList = () => {
    history.push(projectListPath);
  };

  useEffect(() => {
    if (error) {
      history.replace(projectListPath);
    }
  }, [error]);

  if (loading || !data) {
    return <Spin />;
  }

  return (
    <div className="dashboard-main">
      <div className="slider">
        <header onClick={goProjectList}>Oumi UI 管理器</header>
        <div className="select flex-center">
          <Select style={{ width: 180 }} value={data.id}>
            {projectList &&
              projectList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>
        <div className="slider-list">
          <div className="slider-list-item">模版</div>
          <div className="slider-list-item">Swagger</div>
        </div>
      </div>
      <div className="content">111</div>
    </div>
  );
};
