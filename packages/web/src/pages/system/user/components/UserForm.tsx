import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import type { User, Store, Role } from '@/db';
import { storeApi, roleApi } from '@/services/api';

interface UserFormProps {
  visible: boolean;
  onCancel: () => void;
  user: User | null;
  onSubmit: (values: Partial<User>) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({
  visible,
  onCancel,
  user,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [storeOptions, setStoreOptions] = useState<{ label: string; value: string }[]>([]);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  
  
  // 修改：在选项数据加载完成后再反填表单数据
  useEffect(() => {
    if (visible && user && dataLoaded) {
      
      // 将后端字段映射到表单字段
      const roleIds = user.userRoles?.map(ur => ur.roleId) || [];


      const formData = {
        ...user,
        nickname: user.nickname || user.name, // 兼容旧数据
        storeId: user.storeId || user.store, // 兼容旧数据
        isActive: user.isActive !== undefined ? user.isActive : (user.status === 'active'), // 兼容旧数据
        roleIds, // 用户角色ID数组
      };
     
      form.setFieldsValue(formData);
    } else if (visible && !user) {
      form.resetFields();
    }
  }, [visible, user, form, dataLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoaded(false);
        // 获取门店列表
        const storeData = await storeApi.getList();
        console.log(storeData);
        const storeOpts = storeData.map((store: Store) => ({
          label: store.name,
          value: store.id,
        }));
        setStoreOptions(storeOpts);

        // 获取角色列表
        const roleData = await roleApi.getList();
        const roleOpts = roleData.map((role: Role) => ({
          label: role.name,
          value: role.id,
        }));
        console.log('====roleOpts===', roleOpts)
        setRoleOptions(roleOpts);
        
        // 标记数据加载完成
        setDataLoaded(true);
      } catch (error) {
        console.error('获取数据失败：', error);
        message.error('获取数据失败');
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 确保数据格式符合后端要求
      const submitData = {
        ...values,
        // 移除可能存在的旧字段
        name: undefined,
        store: undefined,
        status: undefined,
        role: undefined, // 移除旧的单个role字段
        userRoles: undefined, // 移除关联对象，只保留roleIds
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };
  

  return (
    <Modal
      title={user ? '编辑用户' : '新增用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {!user && (
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item
          name="nickname"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item
          name="roleIds"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择角色"
            options={roleOptions}
            loading={roleOptions.length === 0}
          />
        </Form.Item>
        <Form.Item
          name="storeId"
          label="所属门店"
          rules={[{ required: true, message: '请选择所属门店' }]}
        >
          <Select
            placeholder="请选择所属门店"
            options={storeOptions}
          />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="请选择状态"
            options={[
              { label: '启用', value: true },
              { label: '禁用', value: false },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;