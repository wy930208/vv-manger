import { Button, Card, Table, Tag, Space, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import { userApi } from '@/services/api';
import type { User } from '@/db';

const UserList: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getList();

      if (data) {
        setUserList(data);
      } else {
        message.error('获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败：', error);
      message.error('获取用户列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      render: (nickname: string, record: User) => nickname || record.name || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 180,
    },
    {
      title: '角色',
      dataIndex: 'userRoles',
      key: 'userRoles',
      width: 150,
      render: (userRoles: any[], record: User) => {
        // 优先使用新的userRoles数据，兼容旧的role字段
        if (userRoles && userRoles.length > 0) {
          return userRoles.map(ur => ur.role?.name || ur.roleId).join(', ');
        }
        // 兼容旧数据
        if (record.role) {
          const roleMap: Record<string, string> = {
            super_admin: '超级管理员',
            admin: '管理员',
            store_manager: '门店管理员',
            staff: '员工',
          };
          return roleMap[record.role] || record.role;
        }
        return '-';
      },
    },
    {
      title: '所属门店',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 120,
      render: (storeId: string | null, record: User) => {
        // 优先显示门店名称，兼容旧数据格式
        if (record.store && typeof record.store === 'object' && record.store.name) {
          return record.store.name;
        }
        return storeId || record.store || '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record: User) => {
        // 兼容新旧数据格式
        const active = isActive !== undefined ? isActive : (record.status === 'active');
        return (
          <Tag color={active ? 'green' : 'red'}>
            {active ? '启用' : '禁用'}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleResetPassword(record)}>重置密码</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = async (user: User) => {
    try {
      // 获取用户详情数据
      const userDetail = await userApi.getById(user.id);
      setCurrentUser(userDetail);
      setFormVisible(true);
    } catch (error) {
      console.error('获取用户详情失败：', error);
      message.error('获取用户详情失败');
    }
  };

  const handleDelete = async (user: User) => {
    try {
      const response = await userApi.delete(user.id);
      message.success('删除成功');
      fetchUserList();
    } catch (error) {
      console.error('删除用户失败：', error);
      message.error('删除失败');
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      const response = await userApi.resetPassword(user.id);
      message.success('密码重置成功');
    } catch (error) {
      console.error('重置密码失败：', error);
      message.error('密码重置失败');
    }
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setFormVisible(true);
  };

  const handleFormSubmit = async (values: Partial<User>) => {
    try {
      let response;
      if (currentUser) {
        response = await userApi.update(currentUser.id, values);
      } else {
        response = await userApi.add(values as Omit<User, 'id'>);
      }
      message.success(currentUser ? '编辑成功' : '新增成功');
      setFormVisible(false);
      fetchUserList();
    } catch (error) {
      console.error(currentUser ? '编辑用户失败：' : '新增用户失败：', error);
      message.error(currentUser ? '编辑失败' : '新增失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增用户
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={userList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
      <UserForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        user={currentUser}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default UserList;