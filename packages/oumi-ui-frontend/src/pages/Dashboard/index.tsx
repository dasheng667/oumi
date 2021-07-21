import React, { useEffect } from 'react';
import { BrowserRouter as Router, useHistory, Link, Switch, Route } from 'react-router-dom';
import { Spin, Select } from 'antd';
import Slider from '../../Components/Slider';
import { useRequest } from '../../hook';
import type { ProjectListItem, IRouter } from '../../global';
import renderRoutes from '../../router/renderRoutes';

import './index.less';

const projectListPath = '/project/select';

type Props = {
  route: IRouter;
  [key: string]: any;
};

export default (props: Props) => {
  const { route = {} } = props;
  // console.log('props', props)

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

  if (error) {
    return (
      <div style={{ padding: 50 }}>
        <Link to={projectListPath}>选择项目</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <Slider goProjectList={goProjectList} projectList={projectList} selectItem={data} />

      <div className="dashboard-body">
        {renderRoutes(route.routes)}
        {history.location.pathname === '/dashboard' && <div className="content">模版</div>}
      </div>
    </div>
  );
};
