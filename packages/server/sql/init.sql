-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `vv_manager` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vv_manager`;

-- 1. 创建门店表
CREATE TABLE `stores` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '门店名称',
  `address` varchar(255) NOT NULL COMMENT '门店地址',
  `phone` varchar(20) NOT NULL COMMENT '门店电话',
  `manager` varchar(50) NOT NULL COMMENT '门店经理',
  `status` varchar(20) NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店表';

-- 2. 创建用户表
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(15) DEFAULT NULL COMMENT '手机号',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `isActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `storeId` varchar(36) DEFAULT NULL COMMENT '所属门店ID',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_username` (`username`),
  UNIQUE KEY `IDX_phone` (`phone`),
  UNIQUE KEY `IDX_email` (`email`),
  KEY `FK_users_storeId` (`storeId`),
  CONSTRAINT `FK_users_storeId` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 3. 创建角色表
CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '角色名称',
  `code` varchar(100) NOT NULL COMMENT '角色编码',
  `description` text COMMENT '角色描述',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_code` (`code`),
  KEY `IDX_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 4. 创建菜单表
CREATE TABLE `menus` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '菜单名称',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
  `path` varchar(255) DEFAULT NULL COMMENT '菜单路径',
  `parentId` varchar(36) DEFAULT NULL COMMENT '父级菜单ID',
  `materializedPath` text COMMENT '物化路径，如: 1/2/3',
  `level` int NOT NULL DEFAULT '0' COMMENT '层级深度',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序值',
  `status` enum('enabled','disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `metadata` json DEFAULT NULL COMMENT '菜单元数据',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `IDX_parentId_sort` (`parentId`,`sort`),
  KEY `IDX_path` (`path`),
  KEY `IDX_status` (`status`),
  CONSTRAINT `FK_menus_parentId` FOREIGN KEY (`parentId`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- 5. 创建用户角色关联表
CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL COMMENT '用户ID',
  `roleId` varchar(36) NOT NULL COMMENT '角色ID',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_userId_roleId` (`userId`,`roleId`),
  KEY `FK_user_roles_roleId` (`roleId`),
  CONSTRAINT `FK_user_roles_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_roles_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 6. 创建角色菜单关联表
CREATE TABLE `role_menus` (
  `id` varchar(36) NOT NULL,
  `roleId` varchar(36) NOT NULL COMMENT '角色ID',
  `menuId` varchar(36) NOT NULL COMMENT '菜单ID',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_roleId_menuId` (`roleId`,`menuId`),
  KEY `FK_role_menus_menuId` (`menuId`),
  CONSTRAINT `FK_role_menus_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_role_menus_menuId` FOREIGN KEY (`menuId`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- 7. 创建客户表
CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '客户姓名',
  `phone` varchar(255) NOT NULL COMMENT '客户电话',
  `email` varchar(255) DEFAULT NULL COMMENT '客户邮箱',
  `address` varchar(255) DEFAULT NULL COMMENT '客户地址',
  `level` varchar(255) NOT NULL COMMENT '客户等级: normal, vip, premium',
  `points` int NOT NULL DEFAULT '0' COMMENT '积分',
  `storeId` varchar(36) DEFAULT NULL COMMENT '所属门店ID',
  `status` varchar(255) NOT NULL COMMENT '状态: active, inactive, blacklist',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `FK_customers_storeId` (`storeId`),
  CONSTRAINT `FK_customers_storeId` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户表';

-- 8. 创建客户记录表
CREATE TABLE `customer_records` (
  `id` varchar(36) NOT NULL,
  `customerId` varchar(36) NOT NULL COMMENT '客户ID',
  `type` varchar(255) NOT NULL COMMENT '记录类型: phone, email, visit, other',
  `description` text NOT NULL COMMENT '记录描述',
  `operatorId` varchar(36) DEFAULT NULL COMMENT '操作员ID',
  `storeId` varchar(36) DEFAULT NULL COMMENT '门店ID',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `FK_customer_records_customerId` (`customerId`),
  KEY `FK_customer_records_operatorId` (`operatorId`),
  KEY `FK_customer_records_storeId` (`storeId`),
  CONSTRAINT `FK_customer_records_customerId` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_customer_records_operatorId` FOREIGN KEY (`operatorId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_customer_records_storeId` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户记录表';

-- 插入初始数据
-- 插入默认角色
INSERT INTO `roles` (`id`, `name`, `code`, `description`, `status`) VALUES
('admin-role-id', '超级管理员', 'admin', '系统超级管理员角色', 'active'),
('manager-role-id', '门店经理', 'manager', '门店经理角色', 'active'),
('staff-role-id', '普通员工', 'staff', '普通员工角色', 'active');

-- 插入默认菜单
INSERT INTO `menus` (`id`, `name`, `icon`, `path`, `parentId`, `level`, `sort`, `status`) VALUES
('dashboard-menu', '仪表盘', 'dashboard', '/dashboard', NULL, 0, 1, 'enabled'),
('user-menu', '用户管理', 'user', '/users', NULL, 0, 2, 'enabled'),
('customer-menu', '客户管理', 'team', '/customers', NULL, 0, 3, 'enabled'),
('store-menu', '门店管理', 'shop', '/stores', NULL, 0, 4, 'enabled'),
('role-menu', '角色管理', 'safety', '/roles', NULL, 0, 5, 'enabled'),
('menu-menu', '菜单管理', 'menu', '/menus', NULL, 0, 6, 'enabled');

-- 为超级管理员角色分配所有菜单权限
INSERT INTO `role_menus` (`id`, `roleId`, `menuId`) VALUES
(UUID(), 'admin-role-id', 'dashboard-menu'),
(UUID(), 'admin-role-id', 'user-menu'),
(UUID(), 'admin-role-id', 'customer-menu'),
(UUID(), 'admin-role-id', 'store-menu'),
(UUID(), 'admin-role-id', 'role-menu'),
(UUID(), 'admin-role-id', 'menu-menu');

COMMIT;