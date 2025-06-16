import { Button, Card, Table, Tag, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import StaffForm from './components/StaffForm';

const StaffList: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const response = await request('/api/store/staff');
      setStaffList(response.data);
    } catch (error) {
      message.error('获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleEdit = (record: any) => {
    setCurrentStaff(record);
    setFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await request(`/api/store/staff/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchStaffList();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleAdd = () => {
    setCurrentStaff(null);
    setFormVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentStaff) {
        await request(`/api/store/staff/${currentStaff.id}`, {
          method: 'PUT',
          data: values,
        });
        message.success('编辑成功');
      } else {
        await request('/api/store/staff', {
          method: 'POST',
          data: values,
        });
        message.success('新增成功');
      }
      setFormVisible(false);
      fetchStaffList();
    } catch (error) {
      message.error(currentStaff ? '编辑失败' : '新增失败');
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '所属门店',
      dataIndex: 'store',
      key: 'store',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增员工
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={staffList}
          rowKey="id"
          loading={loading}
        />
      </Card>
      <StaffForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        staff={currentStaff}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default StaffList; 