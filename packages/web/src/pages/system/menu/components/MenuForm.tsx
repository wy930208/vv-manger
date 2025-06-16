import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useEffect } from 'react';
import type { Menu } from '@/db';

interface MenuFormProps {
  visible: boolean;
  onCancel: () => void;
  menu?: Menu | null;
  onSubmit: (values: Partial<Menu>) => Promise<void>;
  menuList: Menu[];
}

const MenuForm: React.FC<MenuFormProps> = ({
  visible,
  onCancel,
  menu,
  onSubmit,
  menuList,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && menu) {
      form.setFieldsValue(menu);
    } else {
      form.resetFields();
    }
  }, [visible, menu, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  // 获取顶级菜单选项
  const getTopMenuOptions = () => {
    return menuList
      .filter(item => !item.parentId)
      .map(item => ({
        label: item.name,
        value: item.id, // 确保ID类型一致
      }));
  };

  // 获取图标选项
  const iconOptions = [
    { label: '设置', value: 'SettingOutlined' },
    { label: '菜单', value: 'MenuOutlined' },
    { label: '团队', value: 'TeamOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '商店', value: 'ShopOutlined' },
    { label: '客户服务', value: 'CustomerServiceOutlined' },
  ];

  return (
    <Modal
      title={menu ? '编辑菜单' : '新增菜单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={menu as any}
      >
        <Form.Item
          name="name"
          label="菜单名称"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>
  
        <Form.Item
          name="icon"
          label="图标"
          rules={[{ required: true, message: '请选择图标' }]}
        >
          <Select
            placeholder="请选择图标"
            options={iconOptions}
          />
        </Form.Item>
        <Form.Item
          name="path"
          label="路径"
          rules={[{ required: true, message: '请输入路径' }]}
        >
          <Input placeholder="请输入路径" />
        </Form.Item>
        <Form.Item
          name="parentId"
          label="上级菜单"
        >
          <Select
            placeholder="请选择上级菜单"
            allowClear
            options={getTopMenuOptions()}
          />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序号' }]}
        >
          <InputNumber min={1} placeholder="请输入排序号" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="请选择状态"
            options={[
              { label: '启用', value: 'enabled' },
              { label: '禁用', value: 'disabled' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuForm;