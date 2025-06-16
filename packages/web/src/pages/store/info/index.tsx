import { Button, Card, Table, Space, Tag, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import StoreForm from './components/StoreForm';

const StoreList: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [storeList, setStoreList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStoreList = async () => {
    setLoading(true);
    try {
      const response = await request('/api/stores');
      setStoreList(response.data);
    } catch (error) {
      message.error('获取门店列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStoreList();
  }, []);

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    },
   
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '店长',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '营业时间',
      dataIndex: 'businessHours',
      key: 'businessHours',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '营业中' : '已关闭'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = (store: any) => {
    setCurrentStore(store);
    setFormVisible(true);
  };

  const handleDelete = async (store: any) => {
    try {
      const response = await request(`/api/stores/${store.id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        message.success('删除成功');
        fetchStoreList();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleAdd = () => {
    setCurrentStore(null);
    setFormVisible(true);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const url = currentStore
        ? `/api/stores/${currentStore.id}`
        : '/api/stores';
      const method = currentStore ? 'PATCH' : 'POST';
      const response = await request(url, {
        method,
        data: values,
      });
      if (response.success) {
        message.success(currentStore ? '编辑成功' : '新增成功');
        setFormVisible(false);
        fetchStoreList();
      }
    } catch (error) {
      message.error(currentStore ? '编辑失败' : '新增失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增门店
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={storeList}
          rowKey="id"
          loading={loading}
        />
      </Card>
      <StoreForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        store={currentStore}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default StoreList;