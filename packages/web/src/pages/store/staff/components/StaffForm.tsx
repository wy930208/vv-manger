import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

interface StaffFormProps {
  visible: boolean;
  onCancel: () => void;
  staff?: any;
  onSubmit: (values: any) => Promise<void>;
}

const StaffForm: React.FC<StaffFormProps> = ({
  visible,
  onCancel,
  staff,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && staff) {
      form.setFieldsValue({
        ...staff,
        joinDate: staff.joinDate ? dayjs(staff.joinDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [visible, staff, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  const positionOptions = [
    { label: '店长', value: '店长' },
    { label: '销售顾问', value: '销售顾问' },
    { label: '收银员', value: '收银员' },
    { label: '库存管理员', value: '库存管理员' },
  ];

  const storeOptions = [
    { label: '上海门店', value: '上海门店' },
    { label: '北京门店', value: '北京门店' },
  ];

  return (
    <Modal
      title={staff ? '编辑员工' : '新增员工'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={staff}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="employeeId"
          label="工号"
          rules={[{ required: true, message: '请输入工号' }]}
        >
          <Input placeholder="请输入工号" />
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
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          name="position"
          label="职位"
          rules={[{ required: true, message: '请选择职位' }]}
        >
          <Select
            placeholder="请选择职位"
            options={positionOptions}
          />
        </Form.Item>
        <Form.Item
          name="store"
          label="所属门店"
          rules={[{ required: true, message: '请选择所属门店' }]}
        >
          <Select
            placeholder="请选择所属门店"
            options={storeOptions}
          />
        </Form.Item>
        <Form.Item
          name="joinDate"
          label="入职日期"
          rules={[{ required: true, message: '请选择入职日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="请选择入职日期"
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
              { label: '在职', value: 'active' },
              { label: '离职', value: 'inactive' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffForm; 