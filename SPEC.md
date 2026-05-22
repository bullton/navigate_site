# 应用导航系统 (AppHub) - 技术规范文档

## 1. 项目概述

### 项目名称与定位
- **项目名称**: AppHub - 应用导航系统
- **项目类型**: 全栈 Web 应用 (React + Node.js + MongoDB)
- **核心功能**: 为个人/团队管理的多个网页应用提供统一导航入口和管理后台
- **目标用户**: 开发者/团队管理员 (管理视角) + 普通用户 (访问视角)

### 设计风格
- **视觉风格**: 现代简洁，类似 Vercel、Linear、Stripe 等科技公司风格
- **主色调**: 深色主题背景 + 渐变点缀色
- **设计语言**: 极简主义、大量留白、精致阴影、流畅动效

---

## 2. 技术栈

### 前端
- **框架**: React 18 + Vite
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS
- **图标**: Lucide React

### 后端
- **运行时**: Node.js 18+
- **框架**: Express.js
- **数据库**: MongoDB + Mongoose ODM
- **验证**: JWT (JSON Web Tokens)
- **测试**: Jest + mongodb-memory-server (mock 数据库)
- **API 文档**: RESTful API

---

## 3. 数据库模型

### App (应用) - nav_apps
```javascript
{
  _id: ObjectId,
  name: String,              // 应用名称 (必填)
  slug: String,             // URL 友好的标识符 (必填, 唯一)
  description: String,      // 应用描述
  url: String,              // 应用入口 URL (必填)
  icon: String,             // 图标名称 (Lucide 图标库)
  category: String,         // 分类: "ai", "dev", "productivity", "entertainment", "other"
  tags: [String],           // 标签数组
  status: String,           // "active", "inactive", "maintenance"
  featured: Boolean,        // 是否在首页推荐
  sortOrder: Number,        // 排序权重
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastAccessedAt: Date,
    viewCount: Number
  }
}
```

### Category (分类) - nav_categories
```javascript
{
  _id: ObjectId,
  name: String,             // 分类名称
  slug: String,             // 唯一标识
  description: String,
  icon: String,            // 图标名称
  sortOrder: Number,
  createdAt: Date
}
```

### Admin (管理员) - nav_admins
```javascript
{
  _id: ObjectId,
  username: String,         // 用户名 (唯一)
  email: String,            // 邮箱 (唯一)
  password: String,         // 密码 (bcrypt 加密)
  role: String,             // "super_admin", "admin"
  createdAt: Date,
  lastLoginAt: Date
}
```

---

## 4. API 设计

### 公开 API (用户视图)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/apps | 获取所有启用的应用列表 |
| GET | /api/apps/:slug | 获取单个应用详情 |
| GET | /api/apps/featured | 获取推荐应用列表 |
| GET | /api/categories | 获取所有分类 |

### 管理 API (需认证)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/admin/login | 管理员登录 |
| POST | /api/admin/logout | 登出 |
| GET | /api/admin/apps | 获取所有应用 (含禁用) |
| POST | /api/admin/apps | 创建新应用 |
| PUT | /api/admin/apps/:id | 更新应用 |
| DELETE | /api/admin/apps/:id | 删除应用 |
| PATCH | /api/admin/apps/:id/toggle-status | 切换应用状态 |
| GET | /api/admin/categories | 获取所有分类 |
| POST | /api/admin/categories | 创建分类 |
| PUT | /api/admin/categories/:id | 更新分类 |
| DELETE | /api/admin/categories/:id | 删除分类 |
| GET | /api/admin/stats | 获取统计数据 |

---

## 5. 前端页面结构

### 用户端
- `/` - 首页 (应用卡片网格 + 分类筛选 + 搜索)
- `/app/:slug` - 应用详情页
- `/category/:slug` - 分类页面

### 管理端
- `/admin` - 管理员登录页
- `/admin/dashboard` - 管理仪表板
- `/admin/apps` - 应用管理列表
- `/admin/apps/new` - 创建新应用
- `/admin/apps/:id/edit` - 编辑应用
- `/admin/categories` - 分类管理

---

## 6. 用户端界面设计

### 导航栏
- 左侧: Logo "AppHub"
- 中间: 搜索框 (实时搜索应用)
- 右侧: 分类筛选下拉

### 首页布局
- Hero 区域: 大标题 + 描述文字
- 分类标签栏: 水平滚动的分类 chips
- 应用卡片网格: 响应式 1-4 列
- 每个卡片: 图标/Logo + 应用名称 + 描述 + 状态指示点

### 设计细节
- 背景: 深灰渐变 (#0a0a0f → #1a1a2e)
- 卡片: 半透明毛玻璃效果 (glassmorphism)
- 悬停: 卡片轻微上浮 + 发光边框
- 动画: 入场动画 (staggered fade-in)

---

## 7. 管理后台界面设计

### 布局
- 侧边栏导航 (深色) + 主内容区 (浅色)
- 顶部: 页面标题 + 操作按钮

### 功能模块
- **仪表板**: 统计卡片 (应用总数、活跃应用、分类数、最近添加)
- **应用管理**: 表格视图 + CRUD 操作
- **分类管理**: 简单的增删改

---

## 8. 测试策略

### 后端测试 (Jest + mongodb-memory-server)
- **单元测试**: 业务逻辑函数
- **集成测试**: API 路由 (使用 mock 数据库)
- **测试覆盖率**: 核心功能 80%+

### Mock 数据策略
- 使用 `mongodb-memory-server` 创建临时内存数据库
- 每个测试用例独立设置/清理数据
- API 测试覆盖 CRUD 操作

---

## 9. 项目结构

```
navigate/
├── server/                 # 后端
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── models/         # Mongoose 模型
│   │   ├── routes/         # API 路由
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── app.js          # Express 应用入口
│   ├── tests/              # 测试文件
│   ├── package.json
│   └── jest.config.js
├── client/                 # 前端
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义 hooks
│   │   ├── stores/         # Zustand store
│   │   ├── api/            # API 调用
│   │   └── styles/         # 全局样式
│   ├── package.json
│   └── vite.config.js
├── SPEC.md
└── README.md
```

---

## 10. 环境变量

### 后端 (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/navigate
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```