/*
 * @Description: 
 * @Author: huangzhiwei
 * @Date: 2025-06-14 14:07:57
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 14:37:18
 */
import React from 'react';
import { Avatar, Dropdown, Space, Typography, Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import type { MenuProps } from 'antd';

const { Text } = Typography;

interface RightContentProps {
  initialState?: {
    currentUser?: {
      id: string;
      username: string;
      nickname?: string;
      avatar?: string;
    };
  };
}

const RightContent: React.FC<RightContentProps> = ({ initialState }) => {
  const currentUser = initialState?.currentUser;

  const handleLogout = () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('currentUser');
    // 跳转到登录页
    history.push('/login');
    // 刷新页面以重新获取 initialState
    window.location.reload();
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  if (!currentUser) {
    return (
      <Button type="primary" onClick={() => history.push('/login')}>
        登录
      </Button>
    );
  }

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space
        style={{
          cursor: 'pointer',
          padding: '0 12px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar 
          size="small" 
          icon={<UserOutlined />} 
          src={currentUser.avatar}
        />
        <Text
         
        >
          {currentUser.nickname || currentUser.username}
        </Text>
      </Space>
    </Dropdown>
  );
};

export default RightContent;