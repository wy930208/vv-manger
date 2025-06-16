import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { history, useModel, request } from '@umijs/max';
import styles from './index.less';

const LoginPage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      // 调用登录接口
      const { data } = await request('/api/auth/login', {
        method: 'POST',
        data: values,
      });

      console.log('=====data====', data);

      message.success('登录成功！');
      // 保存用户信息
      const userData = {
        id: data.user.id,
        username: data.user.username,
        nickname: data.user.nickname,
        avatar: data.user.avatar,
        token: data.access_token
      };

      await setInitialState((s) => ({
        ...s,
        currentUser: userData,
      }));
      localStorage.setItem('currentUser', JSON.stringify(userData));
      // 跳转到首页
      history.push('/');
    } catch (error) {
      console.error(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>后台管理系统</h1>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          className={styles.form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;