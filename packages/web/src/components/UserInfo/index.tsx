import React from 'react';
import { Avatar, Dropdown, Space, Typography, Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, history } from '@umijs/max';
import type { MenuProps } from 'antd';
import styles from './index.less';

const { Text } = Typography;

const UserInfo: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const handleLogout = async () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('currentUser');
    // 清除全局状态
    await setInitialState((s) => ({
      ...s,
      currentUser: undefined,
    }));
    // 跳转到登录页
    history.push('/login');
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
    <div className={styles.userInfo}>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space className={styles.userSpace}>
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            src={currentUser.avatar}
          />
          <Text className={styles.username}>
            {currentUser.nickname || currentUser.username}
          </Text>
        </Space>
      </Dropdown>
    </div>
  );
};

export default UserInfo;