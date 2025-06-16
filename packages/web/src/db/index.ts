import Dexie, { Table } from 'dexie';

// 定义数据模型接口
export interface Menu {
  id: string;
  name: string;
  code: string;
  icon?: string;
  path?: string;
  parentId?: string;
  sort: number;
  status: 'active' | 'inactive';
  children?: Menu[];
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  status: string;
}

export interface User {
  id: string;
  username: string;
  nickname: string; // 后端字段
  name?: string; // 兼容旧数据
  email: string;
  phone: string;
  role?: string; // 兼容旧数据
  roleIds?: string[]; // 用户角色ID数组
  userRoles?: { roleId: string; role: Role }[]; // 用户角色关联
  storeId: string | null; // 后端字段
  store?: Store | string | null; // 门店对象或兼容旧数据
  isActive: boolean; // 后端字段
  status?: string; // 兼容旧数据
  avatar?: string;
  password?: string; // 仅在创建时使用
}

export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  status: string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  store: string;
  position: string;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  level: string;
  points: number;
  store: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  customerId: string;
  type: string;
  description: string;
  operatorId?: string;
  operator?: User;
  storeId?: string;
  store?: Store;
  createdAt: string;
}

// 定义数据库类
export class VVManagerDB extends Dexie {
  menus!: Table<Menu>;
  roles!: Table<Role>;
  users!: Table<User>;
  stores!: Table<Store>;
  staff!: Table<Staff>;
  customers!: Table<Customer>;
  customerRecords!: Table<CustomerRecord>;

  constructor() {
    super('VVManagerDB');
    this.version(1).stores({
      menus: 'id, parentId', // 移除 code 索引
      roles: 'id, code',
      users: 'id, username, role, store',
      stores: 'id, code',
      staff: 'id, store',
      customers: 'id, phone, store',
      customerRecords: 'id, customerId, store',
    });
  }
}

// 创建数据库实例
export const db = new VVManagerDB();

// 初始化数据库
export async function initDB() {
  try {
    // 检查是否已经初始化
    const menuCount = await db.menus.count();
    console.log('当前菜单数量：', menuCount);
    
    if (menuCount > 0) {
      console.log('数据库已经初始化过，跳过初始化');
      return;
    }

    console.log('开始初始化数据...');

    // 初始化菜单数据
    console.log('开始初始化菜单数据...');
    const menus: Menu[] = [
      {
        id: '1',
        name: '系统管理',
        code: 'system',
        icon: 'SettingOutlined',
        path: '/system',
        parentId: undefined,
        sort: 1,
        status: 'active',
      },
      {
        id: '2',
        name: '菜单管理',
        code: 'system:menu',
        icon: 'MenuOutlined',
        path: '/system/menu',
        parentId: '1',
        sort: 1,
        status: 'active',
      },
      {
        id: '3',
        name: '角色管理',
        code: 'system:role',
        icon: 'TeamOutlined',
        path: '/system/role',
        parentId: '1',
        sort: 2,
        status: 'active',
      },
      {
        id: '4',
        name: '用户管理',
        code: 'system:user',
        icon: 'UserOutlined',
        path: '/system/user',
        parentId: '1',
        sort: 3,
        status: 'active',
      },
      {
        id: '5',
        name: '门店管理',
        code: 'system:store',
        icon: 'ShopOutlined',
        path: '/system/store',
        parentId: '1',
        sort: 4,
        status: 'active',
      },
      {
        id: '6',
        name: '客户管理',
        code: 'customer',
        icon: 'CustomerServiceOutlined',
        path: '/customer',
        parentId: undefined,
        sort: 2,
        status: 'active',
      },
      {
        id: '7',
        name: '客户列表',
        code: 'customer:list',
        icon: 'TeamOutlined',
        path: '/customer/list',
        parentId: '6',
        sort: 1,
        status: 'active',
      },
      {
        id: '8',
        name: '客户记录',
        code: 'customer:record',
        icon: 'FileTextOutlined',
        path: '/customer/record',
        parentId: '6',
        sort: 2,
        status: 'active',
      },
    ];
    await db.menus.bulkAdd(menus);
    console.log('菜单数据初始化完成');

    console.log('开始初始化角色数据...');
    // 初始化角色数据
    const roleData = [
      {
        id: '1',
        name: '超级管理员',
        code: 'super_admin',
        description: '系统最高权限',
        permissions: ['system:all', 'store:all', 'customer:all'],
        status: 'active',
      },
      {
        id: '2',
        name: '管理员',
        code: 'admin',
        description: '区域管理权限',
        permissions: ['store:all', 'customer:all'],
        status: 'active',
      },
      {
        id: '3',
        name: '店长',
        code: 'store_manager',
        description: '门店管理权限',
        permissions: ['store:view', 'customer:all'],
        status: 'active',
      },
      {
        id: '4',
        name: '员工',
        code: 'staff',
        description: '基础操作权限',
        permissions: ['customer:view', 'customer:edit'],
        status: 'active',
      },
    ];
    await db.roles.bulkAdd(roleData);
    console.log('角色数据初始化完成');

    console.log('开始初始化门店数据...');
    // 初始化门店数据
    const storeData = [
      {
        id: '1',
        name: '上海总店',
        code: 'SH001',
        address: '上海市浦东新区张江高科技园区',
        phone: '021-12345678',
        manager: '张三',
        status: 'active',
      },
      {
        id: '2',
        name: '北京分店',
        code: 'BJ001',
        address: '北京市朝阳区建国路88号',
        phone: '010-87654321',
        manager: '李四',
        status: 'active',
      },
    ];
    await db.stores.bulkAdd(storeData);
    console.log('门店数据初始化完成');

    console.log('开始初始化用户数据...');
    // 初始化用户数据
    const userData = [
      {
        id: '1',
        username: 'admin',
        name: '系统管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        role: 'super_admin',
        store: null,
        status: 'active',
      },
      {
        id: '2',
        username: 'manager1',
        name: '上海店长',
        email: 'manager1@example.com',
        phone: '13800138001',
        role: 'store_manager',
        store: '1',
        status: 'active',
      },
      {
        id: '3',
        username: 'staff1',
        name: '员工小王',
        email: 'staff1@example.com',
        phone: '13800138002',
        role: 'staff',
        store: '1',
        status: 'active',
      },
    ];
    await db.users.bulkAdd(userData);
    console.log('用户数据初始化完成');

    console.log('所有数据初始化完成');
  } catch (error) {
    console.error('数据库初始化失败：', error);
    throw error;
  }
}