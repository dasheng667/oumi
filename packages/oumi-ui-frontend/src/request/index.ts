import axios from 'axios';
import { message } from 'antd';

import 'antd/lib/message/style/index.css';

const instance = axios.create({
  timeout: 15000
});

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response && response.data && response.data.success === true) {
      return response.data.data;
    }
    const { config, data }: any = response;
    const msg = data && data.msg ? data.msg : '系统繁忙~';

    if (config && config.errorMsg === true) {
      message.destroy();
      message.error(msg);
    }

    return Promise.reject(response.data);
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
