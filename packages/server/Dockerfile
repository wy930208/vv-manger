# 使用 Node.js 20 LTS 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm 和 nest CLI
RUN npm install -g pnpm @nestjs/cli

# 复制根目录的 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/

# 安装所有依赖
RUN pnpm install --frozen-lockfile

# 复制服务端源代码
COPY packages/server/ ./packages/server/

# 设置 NODE_PATH 环境变量指向根目录的 node_modules
ENV NODE_PATH=/app/node_modules

# 构建应用
WORKDIR /app/packages/server
RUN pnpm install
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "run", "start:prod"]