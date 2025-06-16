import React from 'react';
import { Button, Form, Input, message, Divider } from 'antd';
import { history, useModel, request } from '@umijs/max';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './index.less';
// 导入本地 SVG 插图
import loginIllustration from '@/assets/undraw_data-points_uc3j.svg';

const LoginPage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      // 调用登录接口
      const { data } = await request('/api/auth/login', {
        method: 'POST',
        data: values,
      });

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
        {/* 左侧插画区域 */}
        <div className={styles.illustrationSection}>
          <div className={styles.illustration}>
            <img 
              src={loginIllustration}
              alt="Login Illustration"
              className={styles.illustrationImage}
            />
          </div>
          <div className={styles.welcomeText}>
            <h2>欢迎回来</h2>
            <p>登录您的账户，继续您的数字化旅程</p>
          </div>
        </div>
        
        {/* 右侧登录表单 */}
        <div className={styles.loginSection}>
          <div className={styles.loginBox}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>🚀</div>
                <span className={styles.logoText}>[后台管理系统 Demo]</span>
              </div>
              <h1 className={styles.title}>登录</h1>
              <p className={styles.subtitle}>请输入您的凭据以访问您的账户</p>
            </div>
            
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              className={styles.form}
              layout="vertical"
            >
              <Form.Item
                label="邮箱地址"
                name="username"
                rules={[{ required: true, message: '请输入邮箱地址！' }]}
              >
                <Input 
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="your@email.com" 
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="输入您的密码" 
                  size="large"
                  className={styles.input}
                />
              </Form.Item>

              <div className={styles.formOptions}>
                <a href="#" className={styles.forgotPassword}>忘记密码？</a>
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  className={styles.loginButton}
                >
                  登录
                </Button>
              </Form.Item>
              
              {/* <Divider className={styles.divider}>或</Divider> */}
              
              {/* <div className={styles.socialLogin}>
                <Button className={styles.socialButton} block>
                  <span className={styles.socialIcon}>🔗</span>
                  使用 SSO 登录
                </Button>
              </div>
              
              <div className={styles.signupPrompt}>
                还没有账户？ <a href="#" className={styles.signupLink}>立即注册</a>
              </div> */}
            </Form>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <p>粤ICP备2024286737号-1</p>
      </div>
    </div>
  );
};

export default LoginPage;