import { Modal, Form, Input, Select, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import type { Role, Menu } from '@/db';
import { menuApi, roleApi } from '@/services/api';

interface RoleFormProps {
  visible: boolean;
  onCancel: () => void;
  role: Role | null;
  onSubmit: (values: Partial<Role>) => Promise<void>;
}

const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  onCancel,
  role,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [menuTreeData, setMenuTreeData] = useState<any[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

  // 获取菜单树数据
  const fetchMenuTree = async () => {
    try {
      const data = await menuApi.getTree();
     
      if (data) {
        const treeData = convertMenuToTreeData(data);
        setMenuTreeData(treeData);
      }
    } catch (error) {
      console.error('获取菜单树失败：', error);
    }
  };

  // 转换菜单数据为TreeSelect需要的格式
  const convertMenuToTreeData = (menus: Menu[]): any[] => {
    return menus.map(menu => ({
      title: menu.name,
      value: menu.id,
      key: menu.id,
      children: menu.children ? convertMenuToTreeData(menu.children) : undefined,
    }));
  };

  // 获取角色的菜单权限
  const fetchRoleMenus = async (roleId: string) => {
    try {
      const data = await roleApi.getRoleMenus(roleId);
      setSelectedMenus(data);
      form.setFieldValue('menuIds', data);
    } catch (error) {
      console.error('获取角色菜单失败：', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchMenuTree();
      if (role) {
        form.setFieldsValue({
          name: role.name,
          code: role.code,
          description: role.description,
          status: role.status,
        });
        fetchRoleMenus(role.id);
      } else {
        form.resetFields();
        setSelectedMenus([]);
      }
    }
  }, [visible, role, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (role) {
        // 编辑模式：分别处理角色信息和菜单权限
        const { menuIds, ...roleData } = values;
        await onSubmit(roleData);
        if (menuIds) {
          await roleApi.setRoleMenus(role.id, menuIds);
        }
      } else {
        // 新增模式：将菜单权限包含在角色数据中
        await onSubmit(values);
      }
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  return (
    <Modal
      title={role ? '编辑角色' : '新增角色'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          name="code"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        >
          <Input placeholder="请输入角色编码" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          name="menuIds"
          label="菜单权限"
          rules={[{ required: true, message: '请选择菜单权限' }]}
        >
          <TreeSelect
            treeData={menuTreeData}
            placeholder="请选择菜单权限"
            multiple
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            style={{ width: '100%' }}
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
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;