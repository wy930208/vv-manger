# 使用 Node.js 20 LTS 作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm

# 复制根目录的 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/

# 复制前端源代码
COPY packages/web/ ./packages/web/

# 设置 NODE_PATH 环境变量指向根目录的 node_modules
ENV NODE_PATH=/app/node_modules

# 构建应用
WORKDIR /app/packages/web

# 安装所有依赖
RUN pnpm install

# 构建应用
RUN pnpm --filter web run build

# 生产阶段
FROM nginx:alpine

# 打印当前目录
RUN echo "当前目录: $(pwd)"

# 复制构建产物到 nginx 目录
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 8081

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]