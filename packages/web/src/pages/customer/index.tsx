import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, message, Popconfirm, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import CustomerForm from './components/CustomerForm';
import CommunicationRecord from './components/CommunicationRecord';
import { customerApi } from '@/services/api';
import type { Customer } from '@/db';

const CustomerList: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecordVisible, setIsRecordVisible] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  

  const fetchCustomerList = async () => {
    try {
      setLoading(true);
      const response = await customerApi.getList();
      console.log('===response===', response)
      setCustomerList(response);
    } catch (error) {
      console.error('获取客户列表失败：', error);
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleViewRecords(record)}>沟通记录</a>
          <Popconfirm
            title="确定要删除这个客户吗？"
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

  const handleEdit = (record: Customer) => {
    setSelectedCustomer(record);
    setIsModalVisible(true);
  };

  const handleViewRecords = (record: Customer) => {
    setSelectedCustomer(record);
    setIsRecordVisible(true);
  };

  const handleDelete = async (record: Customer) => {
    try {
    await customerApi.delete(record.id);
      message.success('删除成功');
      fetchCustomerList();
      
    } catch (error) {
      console.error('删除客户失败：', error);
      message.error('删除客户失败');
    }
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalVisible(true);
  };

  const handleFormSubmit = async () => {
    await fetchCustomerList();
    setIsModalVisible(false);
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
          新增客户
        </Button>
        <Table
          columns={columns}
          dataSource={customerList || []}
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

      <CustomerForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        customer={selectedCustomer}
        onSuccess={handleFormSubmit}
      />

      <CommunicationRecord
        visible={isRecordVisible}
        onCancel={() => setIsRecordVisible(false)}
        customer={selectedCustomer}
      />
    </PageContainer>
  );
};

export default CustomerList; 