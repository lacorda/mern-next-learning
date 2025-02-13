import axios from 'axios';
import { getSessionToken } from './auth';

const ApiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  timeout: 60000,
  headers: {
    // POST 请求默认 application/json，如需表单格式：headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    'Content-Type': 'application/json'
  }
});

// 请求拦截，处理token等
ApiService.interceptors.request.use(
  config => {
    // 添加token
    if (!config?.noAuth) {
      const token = getSessionToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截，处理报错等
ApiService.interceptors.response.use(
  response => {
    return response?.data || {};
  },
  error => {
    const originalRequest = error.config;

    if (error?.response?.data?.code === 11) {
      // token过期，需要重新登录
      removeSessionAndLogoutUser();
    }


    if (error.response.status === 401 && !originalRequest._retry) {
      // 401错误，需要重新登录
      removeSessionAndLogoutUser();
    }

    return Promise.reject(error);
  }
);

export default ApiService;