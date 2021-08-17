import React, { useState, useEffect } from 'react';
import type { IRouter } from '../../global';
import Container from '../Container';

import './index.less';

type Props = {
  route: IRouter;
  [key: string]: any;
};

export default (props: Props) => {
  console.log('props', props);

  return <Container title="Dashboard">我是Dashboard</Container>;
};
