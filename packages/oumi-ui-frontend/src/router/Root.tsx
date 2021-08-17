import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import renderRoutes from './renderRoutes';
import Slider from '../Components/Slider';

const Root = ({ route }: any) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const { location } = history;
    setVisible(location.pathname !== '/project/select');
  }, [history, history.location]);

  return (
    <>
      {visible && <Slider />}
      <div className="root-container">{renderRoutes(route.routes)}</div>
    </>
  );
};

export default Root;
