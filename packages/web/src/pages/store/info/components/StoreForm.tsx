import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { userApi } from '@/services/api';
import type { User } from '@/db';

interface StoreFormProps {
  visible: boolean;
  onCancel: () => void;
  store?: any;
  onSubmit: (values: any) => Promise<void>;
}

const StoreForm: React.FC<StoreFormProps> = ({
  visible,
  onCancel,
  store,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取用户列表
  const fetchUserList = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getList();
      if (data) {
        setUserList(data);
      }
    } catch (error) {
      console.error('获取用户列表失败：', error);
      message.error('获取用户列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      fetchUserList();
      if (store) {
        form.setFieldsValue(store);
      } else {
        form.resetFields();
      }
    }
  }, [visible, store, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  // 过滤用户选项，可以根据需要筛选特定角色的用户
  const managerOptions = userList
    .filter(user => 
      // 可以根据需要筛选店长角色，比如：
      // user.role === 'store_manager' || user.role === 'admin'
      user.isActive // 只显示激活的用户
    )
    .map(user => ({
      label: `${user.nickname || user.username} (${user.username})`,
      value: user.id,
      user: user, // 保存完整用户信息，方便后续使用
    }));

  return (
    <Modal
      title={store ? '编辑门店' : '新增门店'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={store}
      >
        <Form.Item
          name="name"
          label="门店名称"
          rules={[{ required: true, message: '请输入门店名称' }]}
        >
          <Input placeholder="请输入门店名称" />
        </Form.Item>
        
        <Form.Item
          name="address"
          label="地址"
          rules={[{ required: true, message: '请输入地址' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入地址" />
        </Form.Item>
        
        <Form.Item
          name="manager"
          label="店长"
          rules={[{ required: true, message: '请选择店长' }]}
        >
          <Select
            placeholder="请选择店长"
            loading={loading}
            showSearch
            optionFilterProp="label"
            options={managerOptions}
            notFoundContent={loading ? '加载中...' : '暂无数据'}
          />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="请选择状态"
            options={[
              { label: '营业中', value: 'enabled' },
              { label: '已关闭', value: 'disabled' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StoreForm;