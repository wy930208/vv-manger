
# CRM 客户管理系统 PRD（最终版）

## 1. 技术架构

### 1.1 前端技术栈
- React 18
- Ant Design Pro 5.x
- TypeScript
- UmiJS
- Redux Toolkit
- Ant Design Charts
- React Query

### 1.2 后端技术栈
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Redis
- Swagger

## 2. 系统角色

### 2.1 总部角色
1. 超级管理员（Super Admin）
   - 系统最高权限
   - 菜单管理权限
   - 可以管理所有门店和用户
   - 可以查看所有数据

2. 管理员（Admin）
   - 可以管理指定区域的门店
   - 可以查看指定区域的数据
   - 可以管理门店用户

### 2.2 门店角色
1. 店长（Store Manager）
   - 管理本门店的所有员工
   - 查看本门店的所有数据
   - 管理本门店的客户

2. 员工（Staff）
   - 管理自己负责的客户
   - 查看自己负责的客户数据
   - 添加客户沟通记录

## 3. 功能模块

### 3.1 系统管理
#### 3.1.1 菜单管理
- 菜单创建、编辑、删除
- 菜单排序
- 菜单权限配置
- 菜单图标设置
- 菜单状态管理

#### 3.1.2 权限管理
- 角色管理
- 权限分配
- 权限继承
- 权限验证

#### 3.1.3 用户管理
- 用户创建、编辑、禁用
- 角色分配
- 密码重置
- 登录日志

### 3.2 门店管理
#### 3.2.1 门店信息
- 门店基本信息管理
- 门店状态管理
- 门店人员配置
- 门店数据统计

#### 3.2.2 门店人员
- 店长管理
- 员工管理
- 人员调动
- 绩效统计

### 3.3 客户管理
#### 3.3.1 客户信息
- 客户基本信息
- 客户分类管理
- 客户标签管理
- 客户状态管理

#### 3.3.2 客户导入
- Excel 导入
- 数据验证
- 导入日志
- 错误处理

#### 3.3.3 客户分配
- 客户分配规则
- 自动分配
- 手动分配
- 分配历史

### 3.4 沟通记录
#### 3.4.1 记录管理
- 记录创建
- 记录编辑
- 记录查询
- 记录统计

#### 3.4.2 跟进管理
- 跟进计划
- 跟进提醒
- 跟进统计
- 跟进分析

## 4. 数据库设计

### 4.1 核心表结构
```sql
-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    store_id INTEGER,
    role_id INTEGER,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 门店表
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    manager_id INTEGER,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 客户表
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    store_id INTEGER,
    staff_id INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 沟通记录表
CREATE TABLE communication_records (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    staff_id INTEGER,
    content TEXT,
    type VARCHAR(20),
    next_follow_time TIMESTAMP,
    created_at TIMESTAMP
);
```

## 5. API 设计

### 5.1 认证相关
```typescript
// 登录
POST /api/auth/login
// 登出
POST /api/auth/logout
// 刷新token
POST /api/auth/refresh
```

### 5.2 用户管理
```typescript
// 用户列表
GET /api/users
// 创建用户
POST /api/users
// 更新用户
PUT /api/users/:id
// 删除用户
DELETE /api/users/:id
```

### 5.3 客户管理
```typescript
// 客户列表
GET /api/customers
// 创建客户
POST /api/customers
// 更新客户
PUT /api/customers/:id
// 导入客户
POST /api/customers/import
```

## 6. 前端页面规划

### 6.1 布局设计
- 顶部导航栏
- 左侧菜单栏
- 内容区域
- 页脚信息

### 6.2 主要页面
- 登录页
- 仪表盘
- 系统管理
- 门店管理
- 客户管理
- 沟通记录
- 数据统计

## 7. 开发规范

### 7.1 代码规范
- ESLint 配置
- Prettier 配置
- TypeScript 规范
- Git 提交规范

### 7.2 命名规范
- 文件命名
- 变量命名
- 函数命名
- 组件命名

### 7.3 注释规范
- 文件注释
- 函数注释
- 组件注释
- 接口注释

## 8. 部署方案

### 8.1 开发环境
- 本地开发环境
- 开发服务器
- 测试数据库
- 开发工具配置

### 8.2 生产环境
- 服务器配置
- 数据库配置
- 缓存配置
- 监控配置

## 9. 项目时间规划

### 9.1 第一阶段（2周）
- 项目初始化
- 基础框架搭建
- 权限系统实现
- 用户管理模块

### 9.2 第二阶段（2周）
- 门店管理模块
- 客户管理模块
- 数据导入功能
- 基础统计功能

### 9.3 第三阶段（2周）
- 沟通记录模块
- 数据统计模块
- 系统优化
- 测试部署

## 10. 后续迭代计划
1. 客户标签系统
2. 客户关系图谱
3. 移动端适配
4. 多语言支持
5. 数据导出功能
6. 报表系统
7. 工作流系统
8. 消息通知系统