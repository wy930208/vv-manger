import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, message, Popconfirm, Space, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import RoleForm from './components/RoleForm';
import { roleApi } from '@/services/api';
import type { Role } from '@/db';

const RoleList: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoleList = async () => {
    try {
      setLoading(true);
      const data = await roleApi.getList();
     
      if (data) {
        setRoleList(data);
      } else {
        message.error('获取角色列表失败');
      }
    } catch (error) {
      console.error('获取角色列表失败：', error);
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleList();
  }, []);

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left' as const,
    },
    
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '菜单权限',
      dataIndex: 'roleMenus',
      key: 'roleMenus',
      width: 300,
      render: (roleMenus: any[]) => {
        console.log('roleMenus===', roleMenus);
        if (!roleMenus || roleMenus.length === 0) {
          return '-';
        }
        return (
          <Space wrap>
            {roleMenus.map((roleMenu) => (
              <Tag key={roleMenu.menu.id}>{roleMenu.menu.name}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: Role) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Role) => {
    setSelectedRole(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: Role) => {
    try {
      await roleApi.delete(record.id);
      message.success('删除成功');
      fetchRoleList();
    } catch (error) {
      console.error('删除角色失败：', error);
      message.error('删除失败');
    }
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: Partial<Role>) => {
    try {
      let response;
      if (selectedRole) {
        const { menuIds, ...roleData } = values;
        response = await roleApi.update(selectedRole.id, roleData);
        if (menuIds) {
          await roleApi.setRoleMenus(selectedRole.id, menuIds);
        }
      } else {
        // 新增时直接传递完整数据，包括 menuIds
        response = await roleApi.add(values as Omit<Role, 'id'>);
      }
      
      message.success(selectedRole ? '编辑成功' : '新增成功');
      setIsModalVisible(false);
      fetchRoleList();
    } catch (error) {
      console.error(selectedRole ? '编辑角色失败：' : '新增角色失败：', error);
      message.error(selectedRole ? '编辑失败' : '新增失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          新增角色
        </Button>
        <Table
          columns={columns}
          dataSource={roleList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <RoleForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        role={selectedRole}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default RoleList;