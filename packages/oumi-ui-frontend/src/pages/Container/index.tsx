import React, { memo, useEffect, useMemo, useRef } from 'react';
import { GithubOutlined, BellOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Tooltip, Badge, notification } from 'antd';
import { useRequest } from '@src/hook';

import './index.less';

let isLoad = false;

export default memo((props: { title: string; className?: string; isMain?: boolean; children: any }) => {
  const { title, children, className, isMain } = props;
  // @ts-ignore
  const version = AppVersion;
  const { data, error, request } = useRequest<any>('/api/checkVersion', { params: { version }, lazy: true });

  useEffect(() => {
    if (!isMain) return;
    isLoad = true;
    request().catch(() => {
      isLoad = false;
    });
  }, [isMain]);

  const dot = useMemo(() => {
    if (!data) return false;
    return data.current !== data.latest;
  }, [data]);

  const openNotification = () => {
    let message = '通知';
    let description: any = '暂无消息';

    if (dot) {
      message = '有新版本啦';
      description = (
        <div>
          <p>
            当前版本<span style={{ color: 'green' }}>{data.current}</span>，最新版本<span style={{ color: 'red' }}>{data.latest}</span>
          </p>{' '}
          <b>升级：</b>{' '}
          <p>
            <code>yarn global upgrade --latest @oumi/cli</code>
          </p>
        </div>
      );
    }

    notification.open({
      message,
      description,
      style: { width: 500 },
      icon: <SmileOutlined style={{ color: '#108ee9' }} />
    });
  };

  return (
    <div className="wrapper-container">
      <div className="container-body">
        <div className="header">
          <h2>{title}</h2>
          <div className="right-menu">
            <Space>
              <Badge dot={dot} offset={[-10, 6]}>
                <span className="icon icon-radius" onClick={openNotification}>
                  <BellOutlined />
                </span>
              </Badge>
              <span className="icon icon-radius">
                <Tooltip title="我要加入开源">
                  <a href="https://github.com/dasheng91/oumi" target="_blank">
                    <GithubOutlined />
                  </a>
                </Tooltip>
              </span>
              <span className="icon icon-radius">
                <Tooltip title="向我反馈">
                  <a href="mailto:345263463@qq.com">
                    <MailOutlined />
                  </a>
                </Tooltip>
              </span>
            </Space>
          </div>
        </div>
        <div className={`container-main ${className || ''}`}>{children}</div>
      </div>
    </div>
  );
});
