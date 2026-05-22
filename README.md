# AppHub - 应用导航系统

一个现代化的网站导航系统，使用 React + Node.js + MongoDB 构建。

## 功能特点

- **用户端**：现代简洁的深色主题界面，支持分类筛选和搜索
- **管理后台**：完整的管理界面，包括应用管理、分类管理、仪表板
- **后端 API**：完整的 RESTful API，支持 JWT 认证
- **测试**：使用 mongodb-memory-server 进行集成测试，无需真实数据库

## 技术栈

### 前端
- React 18 + Vite
- React Router v6
- Zustand (状态管理)
- Tailwind CSS
- Lucide React (图标)

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- Jest + mongodb-memory-server (测试)

## 项目结构

```
navigate/
├── server/                 # 后端
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── models/         # Mongoose 模型
│   │   ├── routes/         # API 路由
│   │   ├── controllers/   # 控制器
│   │   ├── middleware/    # 中间件
│   │   └── app.js         # Express 应用入口
│   ├── tests/             # 测试文件
│   ├── scripts/            # 初始化脚本
│   └── package.json
├── client/                 # 前端
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   ├── stores/         # Zustand store
│   │   └── api/            # API 调用
│   └── package.json
├── SPEC.md
└── README.md
```

## 环境配置

### 1. 环境变量配置

在后端 `server/` 目录创建 `.env` 文件：

```bash
# server/.env

# 服务器端口
PORT=5000

# MongoDB 连接地址
# 方式一：本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/navigate

# 方式二：MongoDB Atlas 云数据库
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/navigate?retryWrites=true&w=majority

# JWT 认证密钥 (务必修改为随机字符串)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Token 过期时间
JWT_EXPIRES_IN=7d

# 运行环境
NODE_ENV=development
```

### 2. MongoDB 配置详解

#### 方式一：本地 MongoDB

```bash
# 确保本地已安装并启动 MongoDB
# 默认端口 27017
MONGODB_URI=mongodb://localhost:27017/navigate
```

#### 方式二：MongoDB Atlas 云数据库（推荐）

1. 登录 [MongoDB Atlas](https://www.mongodb.com/atlas) 或使用已有账户
2. 创建免费集群 (M0 Sandbox) 或使用现有集群
3. 在 Security → Database Access 创建数据库用户
4. 在 Security → Network Access 添加 IP 白名单（或允许 0.0.0.0/0）
5. 点击 Connect → Connect your application，复制连接字符串
6. 格式：`mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

示例：
```bash
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/navigate?retryWrites=true&w=majority
```

#### Collection 前缀

为避免与数据库中其他应用冲突，所有 Collection 已添加 `nav_` 前缀：

| Model | Collection Name |
|-------|-----------------|
| Admin | `nav_admins` |
| App | `nav_apps` |
| Category | `nav_categories` |

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 2. 初始化数据库

```bash
cd server

# 创建管理员账号
node scripts/initAdmin.js

# 可选：添加示例数据和分类
node scripts/seed.js
```

> 初始化脚本会使用 `.env` 中的 `MONGODB_URI` 连接数据库

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

### 3. 启动服务

```bash
# 启动后端 (端口 5000)
cd server
npm run dev

# 启动前端 (端口 3000) - 新开终端
cd client
npm run dev
```

### 4. 运行测试

```bash
cd server
npm test
```

## OpenClaw 部署指南

### 部署前准备

1. 确保已安装 Node.js 18+
2. 配置好 MongoDB Atlas（或使用自托管 MongoDB）
3. 获取 Git 仓库地址

### 部署命令

```bash
# 1. 克隆项目
git clone <repository-url>
cd navigate

# 2. 配置环境变量
# 在 server/ 目录创建 .env 文件，填写 MongoDB 连接信息
cd server
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/navigate?retryWrites=true&w=majority
JWT_SECRET=<generate-a-random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
EOF
cd ..

# 3. 安装后端依赖并初始化
cd server
npm install
node scripts/initAdmin.js

# 4. 安装前端依赖并构建
cd ../client
npm install
npm run build

# 5. 启动服务
cd ../server
npm start
```

### 生产环境建议

```bash
# 使用 PM2 管理进程
npm install -g pm2
pm2 start server/src/app.js --name apphub

# 查看日志
pm2 logs apphub

# 重启
pm2 restart apphub
```

## API 端点

### 公开 API
- `GET /api/apps` - 获取所有启用的应用
- `GET /api/apps/:slug` - 获取单个应用
- `GET /api/apps/featured` - 获取推荐应用
- `GET /api/categories` - 获取所有分类

### 管理 API (需认证)
- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/apps` - 获取所有应用
- `POST /api/admin/apps` - 创建应用
- `PUT /api/admin/apps/:id` - 更新应用
- `DELETE /api/admin/apps/:id` - 删除应用
- `PATCH /api/admin/apps/:id/toggle-status` - 切换状态
- `GET /api/admin/categories` - 获取分类
- `POST /api/admin/categories` - 创建分类
- `PUT /api/admin/categories/:id` - 更新分类
- `DELETE /api/admin/categories/:id` - 删除分类

## 页面路由

### 用户端
- `/` - 首页 (应用列表 + 分类筛选)

### 管理端
- `/admin` - 登录页
- `/admin/dashboard` - 仪表板
- `/admin/apps` - 应用管理
- `/admin/apps/new` - 创建应用
- `/admin/apps/:id/edit` - 编辑应用
- `/admin/categories` - 分类管理

## 设计风格

- 深色主题背景 (#0a0a0f → #1a1a2e)
- 毛玻璃效果卡片
- 渐变色强调 (#6366f1 → #8b5cf6)
- Lucide 图标库
- 入场动画效果