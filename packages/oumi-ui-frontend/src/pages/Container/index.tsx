import React, { memo } from 'react';

import './index.less';

export default memo((props: { title: string; className?: string; children: any }) => {
  const { title, children, className } = props;

  return (
    <div className="wrapper-container">
      <div className="container-body">
        <div className="header">
          <h2>{title}</h2>
        </div>
        <div className={`container-main ${className || ''}`}>{children}</div>
      </div>
    </div>
  );
});
