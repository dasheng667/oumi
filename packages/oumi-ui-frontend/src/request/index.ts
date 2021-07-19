import axios from 'axios';
import { message } from 'antd';

import 'antd/lib/message/style/index.css';

const instance = axios.create();

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response && response.data && response.data.success === true) {
      return response.data.data;
    }
    const msg = response.data && response.data.msg ? response.data.msg : '系统繁忙~';
    message.destroy();
    message.error(msg);
    return Promise.reject(response.data);
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
