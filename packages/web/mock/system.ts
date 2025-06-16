

type Request = any;
type Response = any;

// 菜单列表
const menuList = [
  {
    id: '1',
    name: '系统管理',
    code: 'system',
    icon: 'setting',
    path: '/system',
    parentId: null,
    sort: 1,
    status: 'active',
    children: [
      {
        id: '1-1',
        name: '菜单管理',
        // 移除 code 字段
        // code: 'system:menu',
        icon: 'menu',
        path: '/system/menu',
        parentId: '1',
        sort: 1,
        status: 'active',
      },
      {
        id: '1-2',
        name: '角色管理',
        // 移除 code 字段
        // code: 'system:role',
        icon: 'team',
        path: '/system/role',
        parentId: '1',
        sort: 2,
        status: 'active',
      },
      {
        id: '1-3',
        name: '用户管理',
        code: 'system:user',
        icon: 'user',
        path: '/system/user',
        parentId: '1',
        sort: 3,
        status: 'active',
      },
    ],
  },
  {
    id: '2',
    name: '门店管理',
    code: 'store',
    icon: 'shop',
    path: '/store',
    parentId: null,
    sort: 2,
    status: 'active',
    children: [
      {
        id: '2-1',
        name: '门店信息',
        code: 'store:info',
        icon: 'info-circle',
        path: '/store/info',
        parentId: '2',
        sort: 1,
        status: 'active',
      },
      {
        id: '2-2',
        name: '员工管理',
        code: 'store:staff',
        icon: 'team',
        path: '/store/staff',
        parentId: '2',
        sort: 2,
        status: 'active',
      },
    ],
  },
];

// 角色列表
const roleList = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '系统最高权限',
    permissions: ['*'],
    status: 'active',
  },
  {
    id: '2',
    name: '管理员',
    code: 'admin',
    description: '系统管理权限',
    permissions: [
      'system:menu:view',
      'system:menu:edit',
      'system:role:view',
      'system:role:edit',
      'system:user:view',
      'system:user:edit',
    ],
    status: 'active',
  },
  {
    id: '3',
    name: '门店管理员',
    code: 'store_manager',
    description: '门店管理权限',
    permissions: [
      'store:info:view',
      'store:info:edit',
      'store:staff:view',
      'store:staff:edit',
    ],
    status: 'active',
  },
];

// 用户列表
const userList = [
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
    username: 'manager',
    name: '门店经理',
    email: 'manager@example.com',
    phone: '13800138001',
    role: 'store_manager',
    store: 'store1',
    status: 'active',
  },
  {
    id: '3',
    username: 'staff',
    name: '门店员工',
    email: 'staff@example.com',
    phone: '13800138002',
    role: 'store_manager',
    store: 'store1',
    status: 'active',
  },
];

// 菜单相关接口
export default {
  // 获取菜单列表
  'GET /api/system/menus': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: menuList,
    });
  },

  // 新增菜单
  'POST /api/system/menus': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  // 编辑菜单
  'PUT /api/system/menus/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  // 删除菜单
  'DELETE /api/system/menus/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
    });
  },

  // 角色相关接口
  'GET /api/system/roles': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: roleList,
    });
  },

  'POST /api/system/roles': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  'PUT /api/system/roles/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  'DELETE /api/system/roles/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
    });
  },

  // 用户相关接口
  'GET /api/system/users': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: userList,
    });
  },

  'POST /api/system/users': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  'PUT /api/system/users/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
      data: req.body,
    });
  },

  'DELETE /api/system/users/:id': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
    });
  },

  // 重置密码
  'POST /api/system/users/:id/reset-password': (req: Request, res: Response) => {
    res.json({
      code: 200,
      message: 'success',
    });
  },
};