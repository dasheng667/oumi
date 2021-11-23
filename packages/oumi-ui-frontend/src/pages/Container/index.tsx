import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { GithubOutlined, BellOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Tooltip, Badge, notification, Dropdown, List } from 'antd';
import { useRequest } from '@src/hook';

import './index.less';

let isLoad = false;

interface ListItem {
  title: string;
  description: string;
  date: string;
  href?: string;
}

type NoticesData = { notices: ListItem[]; currentDate: string };

const NoticesKey = 'oumi-notices-cache';

const Notices = {
  setKey(key: string) {
    localStorage.setItem(NoticesKey, key);
  },
  getKey() {
    return localStorage.getItem(NoticesKey);
  },
  clear() {
    localStorage.removeItem(NoticesKey);
  }
};

export default memo((props: { title: string; className?: string; isMain?: boolean; children: any }) => {
  const { title, children, className, isMain } = props;
  // @ts-ignore
  const version = AppVersion;
  const [isRead, setRead] = useState<null | boolean>(null);
  const {
    data: noticesData,
    loading,
    request: requestNotices
  } = useRequest<NoticesData>('/api/notices', {
    params: { version },
    lazy: true
  });

  useEffect(() => {
    if (!isMain) return;
    isLoad = true;
    requestNotices();
  }, [isMain]);

  useEffect(() => {
    if (!noticesData) return;
    setRead(Notices.getKey() === noticesData.currentDate);
  }, [noticesData]);

  const notices = useMemo(() => {
    if (!noticesData) return [];
    if (Array.isArray(noticesData.notices)) return noticesData.notices.slice(0, 3);
    return [];
  }, [noticesData]);

  const count = useMemo(() => {
    if (!notices || isRead || isRead === null) return 0;
    return notices.length;
  }, [notices, isRead]);

  const cleanNotices = (e: any) => {
    setRead(true);
    Notices.setKey(noticesData.currentDate);
    e.stopPropagation();
  };

  const NotificationContainer = () => {
    return (
      <div className="notification-popup">
        <List
          className={isRead ? 'is-read' : ''}
          itemLayout="horizontal"
          dataSource={notices}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  item.href ? (
                    <a href={item.href} target="_blank">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )
                }
                description={item.description}
              />
              <div>{item.date}</div>
            </List.Item>
          )}
        />
        {notices.length > 0 && (
          <div className="bottom-btn" onClick={(e) => cleanNotices(e)}>
            清空消息
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="wrapper-container">
      <div className="container-body">
        <div className="header">
          <h2>{title}</h2>
          <div className="right-menu">
            <Space>
              <Badge count={count} offset={[-10, 6]}>
                <Dropdown overlay={NotificationContainer} placement="bottomRight" trigger={['click']}>
                  <span className="icon icon-radius">
                    <BellOutlined />
                  </span>
                </Dropdown>
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
