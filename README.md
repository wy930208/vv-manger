# CRM 客户管理系统

基于 React + NestJS 的现代化客户管理系统。

## 项目结构

```
.
├── packages/
│   ├── web/          # 前端项目 (UmiJS + React)
│   └── server/       # 后端项目 (NestJS)
├── pnpm-workspace.yaml
└── package.json
```

## 开发环境要求

- Node.js >= 16
- pnpm >= 8

## 开发命令

### 安装依赖
```bash
pnpm install
```

### 开发前端
```bash
cd packages/web
pnpm dev
```

### 开发后端
```bash
cd packages/server
pnpm start:dev
```

## 技术栈

### 前端
- React 18
- Ant Design Pro 5.x
- TypeScript
- UmiJS
- Redux Toolkit
- Ant Design Charts
- React Query

### 后端
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Redis
- Swagger 