/*
 * @Description: 
 * @Author: huangzhiwei
 * @Date: 2025-06-08 20:38:22
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 15:08:13
 */
import { RequestConfig, history } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import RightContent from '@/components/RightContent';
// import { initDB } from './db';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  currentUser?: any;
  fetchUserInfo?: () => Promise<any>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      return null;
    }
  };

  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
  };
}

export const layout = () => {
  return {
    layout: 'mix',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    antd: {
      appAlgorithm: true,
    },
    onPageChange: () => {
      const { location } = history;
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser && location.pathname !== '/login') {
        history.push('/login');
      }
    },
    // 使用正确的 rightRender 字段
    rightRender: (initialState: any) => {
      return React.createElement(RightContent, {
        initialState,
      });
    },
    footerRender: () => {
      return React.createElement('div', {
        style: {
          textAlign: 'center',
          padding: '16px 0',
          color: '#666',
          fontSize: '12px',
          borderTop: '1px solid #f0f0f0'
        }
      }, '粤ICP备2024286737号-1');
    },
  };
};

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    // 错误抛出器：根据后端返回的数据判断是否为错误
    errorThrower: (res: any) => {
      const { code, message: msg, data } = res;
      if (code !== 0) {
        const error: any = new Error(msg || '请求失败');
        error.name = 'BizError';
        error.info = { code, message: msg, data };
        throw error;
      }
    },
    // 错误处理器：统一处理错误
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      
      if (error.name === 'BizError') {
        // 业务错误
        message.error(error.message);
      } else if (error.response) {
        // HTTP错误
        const { status, statusText } = error.response;
        message.error(`请求错误 ${status}: ${statusText}`);
      } else {
        // 网络错误等
        message.error(error.message || '网络错误，请稍后重试');
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 统一添加 /api 前缀
      if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
      
      // 添加token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      const { data } = response;
      // 如果后端返回的是统一格式，直接返回
      if (data && typeof data === 'object' && 'code' in data) {
        return response;
      }
      // 否则包装成统一格式（兼容旧接口）
      response.data = {
        code: 0,
        message: '操作成功',
        data: data,
      };
      return response;
    },
  ],
};

// initDB()
//   .then(() => {
//     console.log('数据库初始化完成');
//   })
//   .catch((error) => {
//     console.error('数据库初始化失败：', error);
//   });

