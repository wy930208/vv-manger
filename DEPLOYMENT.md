# VV Management System 部署指南

本项目支持使用 Docker Compose 进行一键部署。

## 前置要求

- Docker
- Docker Compose

## 部署步骤

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd vv-manger
```

### 2. 环境配置

在生产环境中，请修改 `docker-compose.yml` 中的以下配置：

- `MYSQL_ROOT_PASSWORD`: MySQL root 密码
- `MYSQL_PASSWORD`: 应用数据库密码
- `JWT_SECRET`: JWT 密钥（请使用强密码）

### 3. 启动服务

```bash
# 构建并启动所有服务
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 4. 访问应用

- 前端应用: http://localhost
- 后端 API: http://localhost:3000
- MySQL 数据库: localhost:3306

### 5. 停止服务

```bash
# 停止所有服务
docker compose down

# 停止服务并删除数据卷（注意：这会删除所有数据）
docker compose down -v
```

## 服务说明

### MySQL 数据库
- 端口: 3306
- 数据库名: vv_manager
- 用户名: app_user
- 数据持久化: 使用 Docker 卷存储

### 后端服务 (NestJS)
- 端口: 3000
- 基于 Node.js 18
- 自动连接 MySQL 数据库

### 前端服务 (React + Nginx)
- 端口: 80
- 使用 Nginx 提供静态文件服务
- API 请求自动代理到后端服务

## 故障排除

### 查看服务日志
```bash
# 查看所有服务日志
docker compose logs

# 查看特定服务日志
docker compose logs server
docker compose logs web
docker compose logs mysql
```

### 重新构建服务
```bash
# 重新构建并启动
docker compose up -d --build

# 重新构建特定服务
docker compose build server
docker compose up -d server
```

### 数据库连接问题
如果后端无法连接数据库，请检查：
1. MySQL 服务是否正常启动
2. 数据库配置是否正确
3. 网络连接是否正常

### 端口冲突
如果遇到端口冲突，可以修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:80"  # 将前端端口改为 8080
  - "3001:3000" # 将后端端口改为 3001
```

## 生产环境建议

1. **安全配置**
   - 修改默认密码
   - 使用强 JWT 密钥
   - 配置防火墙规则

2. **性能优化**
   - 配置 Nginx 缓存
   - 使用 CDN 加速静态资源
   - 配置数据库连接池

3. **监控和日志**
   - 配置日志收集
   - 设置监控告警
   - 定期备份数据库

4. **SSL/HTTPS**
   - 配置 SSL 证书
   - 强制 HTTPS 访问