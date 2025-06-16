import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    compact: true,
    theme: {
      token: {
        colorPrimary: '#1890FF',
        borderRadius: 4,
        colorBgLayout: '#F0F2F5',
        colorBgContainer: '#FFFFFF',
        colorText: '#333333',
        colorTextSecondary: '#666666',
        colorSuccess: '#52C41A',
        colorWarning: '#FAAD14',
        colorError: '#FF4D4F',
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  // 配置request插件
  request: {},
  // mock: {
  //   include: ['mock/**/*.ts'],
  // },
  // 添加代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  layout: {
    title: '后台管理系统',
    layout: 'mix',
    splitMenus: true,
    navTheme: 'dark',
    primaryColor: '#1890FF',
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
  },
  routes: [
    {
      path: '/login',
      component: './login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: '首页',
      icon: 'smile',
      component: './Home',
    },
    {
      path: '/customer',
      name: '客户管理',
      icon: 'team',
      component: './customer',
    },
    {
      path: '/system',
      name: '系统管理',
      icon: 'setting',
      // access: 'canAdmin',
      routes: [
        {
          path: '/system/menu',
          name: '菜单管理',
          component: './system/menu',
        },
        {
          path: '/system/role',
          name: '权限管理',
          component: './system/role',
        },
        {
          path: '/system/user',
          name: '用户管理',
          component: './system/user',
        },
      ],
    },
    {
      path: '/store',
      name: '门店管理',
      icon: 'shop',
      // access: 'canAdmin',
      routes: [
        {
          path: '/store/info',
          name: '门店信息',
          component: './store/info',
        },
        {
          path: '/store/staff',
          name: '门店人员',
          component: './store/staff',
        },
      ],
    },
    {
      path: '/admin',
      name: '管理页',
      icon: 'crown',
      // access: 'canAdmin',
      routes: [
        {
          path: '/admin',
          redirect: '/admin/sub-page',
        },
        {
          path: '/admin/sub-page',
          name: '子页面',
          component: './Admin',
        },
        {
          path: '/admin/table',
          name: 'Table',
          component: './Table',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
