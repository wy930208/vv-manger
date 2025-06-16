import { Button, Card, Table, Tag, Space, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import MenuForm from './components/MenuForm';
import { useRequest } from '@umijs/max';
import { menuApi } from '@/services/api';
import type { Menu } from '@/db';

const MenuList: React.FC = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenuList = async () => {
    setLoading(true);
    try {
      // 可以选择使用树形接口或普通列表接口
      const data = await menuApi.getList(); // 或者 menuApi.getTree()
      if (data) {
        // 如果使用普通列表接口，需要构建树形结构
        const menuTree = buildMenuTree(data);
        setMenuList(menuTree);
      } else {
        message.error('获取菜单列表失败');
      }
    } catch (error) {
      console.error('获取菜单列表失败：', error);
      message.error('获取菜单列表失败');
    }
    setLoading(false);
  };

  // 构建菜单树
  const buildMenuTree = (menus: Menu[]) => {
    const menuMap = new Map<string, Menu>();
    const tree: Menu[] = [];

    // 先将所有菜单放入 Map
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu });
    });

    // 构建树形结构
    menus.forEach(menu => {
      const node = menuMap.get(menu.id)!;
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  useEffect(() => {
    fetchMenuList();
  }, []);
  
  console.log('===menuList===', menuList)

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon: string) => icon || '-',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (path: string) => path || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
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
      render: (_: unknown, record: Menu) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleEdit = (menu: Menu) => {
    setCurrentMenu(menu);
    setFormVisible(true);
  };

  const MenuPage = () => {
    // 使用useRequest，自动处理loading、error状态
    const { data: menuList, loading, error, refresh } = useRequest(() => {
      return menuApi.getList();
    });
  
    const { run: deleteMenu } = useRequest(menuApi.delete, {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
        refresh(); // 刷新列表
      },
    });
  
    const handleDelete = (id: string) => {
      deleteMenu(id);
    };
  
    if (loading) return <div>加载中...</div>;
    if (error) return <div>加载失败</div>;
  
    return (
      <div>
        {/* 渲染菜单列表 */}
        {menuList?.map(menu => (
          <div key={menu.id}>
            {menu.name}
            <Button onClick={() => handleDelete(menu.id)}>删除</Button>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = async (menu: Menu) => {
    try {
      const response = await menuApi.delete(menu.id);
      message.success('删除成功');
      fetchMenuList();
    } catch (error) {
      console.error('删除菜单失败：', error);
      message.error('删除失败');
    }
  };

  const handleAdd = () => {
    setCurrentMenu(null);
    setFormVisible(true);
  };

  const handleFormSubmit = async (values: Partial<Menu>) => {
    try {
      let response;
      if (currentMenu) {
        response = await menuApi.update(currentMenu.id, values);
      } else {
        response = await menuApi.add(values as Omit<Menu, 'id'>);
      }
      message.success(currentMenu ? '编辑成功' : '新增成功');
      setFormVisible(false);
      fetchMenuList();
    } catch (error) {
      console.error(currentMenu ? '编辑菜单失败：' : '新增菜单失败：', error);
      message.error(currentMenu ? '编辑失败' : '新增失败');
    }
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增菜单
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={menuList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={false}
          expandable={{
            defaultExpandAllRows: true,
          }}
        />
      </Card>
      <MenuForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        menu={currentMenu}
        onSubmit={handleFormSubmit}
        menuList={menuList}
      />
    </PageContainer>
  );
};

export default MenuList;