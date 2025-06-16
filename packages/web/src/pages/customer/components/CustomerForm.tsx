import { Modal, Form, Input, message, Select } from 'antd';
import { useEffect } from 'react';
import { customerApi } from '@/services/api';
import type { Customer } from '@/db';

interface CustomerFormProps {
  visible: boolean;
  onCancel: () => void;
  customer?: Customer | null;
  onSuccess: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  visible,
  onCancel,
  customer,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
  }, [visible, customer, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (customer) {
        // 编辑客户
        const response = await customerApi.update(customer.id, values);

         message.success('编辑成功');
          onSuccess();
      } else {
        // 新增客户
        const response = await customerApi.add(values);
        message.success('新增成功');
        onSuccess();
      }
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  return (
    <Modal
      title={customer ? '编辑客户' : '新增客户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={customer}
      >
        <Form.Item
          name="name"
          label="客户名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input placeholder="请输入客户名称" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { type: 'email', message: '请输入有效的邮箱地址' },
            { required: true, message: '请输入邮箱' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          name="address"
          label="地址"
        >
          <Input.TextArea placeholder="请输入地址" />
        </Form.Item>
        <Form.Item
          name="level"
          label="客户等级"
          rules={[{ required: true, message: '请选择客户等级' }]}
        >
          <Select
            placeholder="请选择客户等级"
            options={[
              { label: '普通客户', value: 'normal' },
              { label: 'VIP客户', value: 'vip' },
              { label: '高级VIP', value: 'premium' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="请选择状态"
            options={[
              { label: '活跃', value: 'active' },
              { label: '非活跃', value: 'inactive' },
              { label: '黑名单', value: 'blacklist' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerForm; 