# 设计文档

## 概述

本设计文档描述了一个类似 Claude Code 产品页面风格的个人网站的前后端分离架构。系统采用 Next.js 作为前端框架（支持 SSR/SSG），Node.js + Express 作为后端 API 服务，MongoDB 作为数据存储。

### 技术栈选型

**前端:**
- Next.js 14 (App Router) - React 框架，支持 SSR/SSG
- TypeScript - 类型安全
- Tailwind CSS - 样式框架
- Framer Motion - 动画效果
- React Query - 数据获取和缓存
- React Hook Form + Zod - 表单验证

**后端:**
- Node.js + Express - API 服务
- TypeScript - 类型安全
- MongoDB + Mongoose - 数据存储
- JWT - 身份认证
- Multer + 云存储 - 文件上传

**部署:**
- Vercel (前端)
- Railway/Render (后端)
- MongoDB Atlas (数据库)
- Cloudinary/AWS S3 (图片存储)

## 架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端 (Browser)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    前端 (Next.js on Vercel)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Pages     │  │ Components  │  │   Hooks     │              │
│  │  - Home     │  │  - Navbar   │  │  - useApi   │              │
│  │  - Blog     │  │  - Hero     │  │  - useAuth  │              │
│  │  - Projects │  │  - Card     │  │             │              │
│  │  - Contact  │  │  - Footer   │  │             │              │
│  │  - Admin    │  │  - Terminal │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ REST API (HTTPS)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   后端 (Express on Railway)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Routes    │  │ Controllers │  │  Services   │              │
│  │  - /api/    │  │  - auth     │  │  - email    │              │
│  │    posts    │  │  - posts    │  │  - upload   │              │
│  │    projects │  │  - projects │  │             │              │
│  │    contact  │  │  - contact  │  │             │              │
│  │    auth     │  │             │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ Middleware  │  │   Models    │                               │
│  │  - auth     │  │  - Post     │                               │
│  │  - validate │  │  - Project  │                               │
│  │  - error    │  │  - User     │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    数据层 (MongoDB Atlas)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    posts    │  │  projects   │  │   users     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 组件和接口

### 前端组件结构

```
frontend/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   ├── blog/
│   │   ├── page.tsx            # 博客列表
│   │   └── [slug]/page.tsx     # 文章详情
│   ├── projects/
│   │   └── page.tsx            # 项目列表
│   ├── contact/
│   │   └── page.tsx            # 联系页面
│   └── admin/
│       ├── page.tsx            # 管理后台
│       └── login/page.tsx      # 登录页
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── FeatureCard.tsx
│   │   └── TypewriterTerminal.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   └── PostContent.tsx
│   ├── projects/
│   │   └── ProjectCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Loading.tsx
├── hooks/
│   ├── useApi.ts
│   └── useAuth.ts
├── lib/
│   ├── api.ts                  # API 客户端
│   └── utils.ts
└── types/
    └── index.ts                # 类型定义
```

### 后端 API 结构

```
backend/
├── src/
│   ├── index.ts                # 入口文件
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── posts.routes.ts
│   │   ├── projects.routes.ts
│   │   └── contact.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── posts.controller.ts
│   │   ├── projects.controller.ts
│   │   └── contact.controller.ts
│   ├── models/
│   │   ├── Post.ts
│   │   ├── Project.ts
│   │   └── User.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── services/
│   │   ├── email.service.ts
│   │   └── upload.service.ts
│   └── utils/
│       └── helpers.ts
└── package.json
```

### API 接口定义

#### 文章 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/posts | 获取文章列表 | 否 |
| GET | /api/posts/:slug | 获取文章详情 | 否 |
| POST | /api/posts | 创建文章 | 是 |
| PUT | /api/posts/:id | 更新文章 | 是 |
| DELETE | /api/posts/:id | 删除文章 | 是 |

#### 项目 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/projects | 获取项目列表 | 否 |
| GET | /api/projects/:id | 获取项目详情 | 否 |
| POST | /api/projects | 创建项目 | 是 |
| PUT | /api/projects/:id | 更新项目 | 是 |
| DELETE | /api/projects/:id | 删除项目 | 是 |

#### 联系 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/contact | 发送联系消息 | 否 |

#### 认证 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 管理员登录 | 否 |
| POST | /api/auth/refresh | 刷新 Token | 是 |
| GET | /api/auth/me | 获取当前用户 | 是 |

## 数据模型

### Post (文章)

```typescript
interface Post {
  _id: ObjectId;
  title: string;           // 文章标题
  slug: string;            // URL 友好的标识符
  content: string;         // Markdown 内容
  excerpt: string;         // 摘要
  coverImage?: string;     // 封面图片 URL
  tags: string[];          // 标签列表
  published: boolean;      // 是否发布
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
}
```

### Project (项目)

```typescript
interface Project {
  _id: ObjectId;
  name: string;            // 项目名称
  description: string;     // 项目描述
  techStack: string[];     // 技术栈
  imageUrl?: string;       // 项目截图
  liveUrl?: string;        // 在线演示链接
  githubUrl?: string;      // GitHub 链接
  featured: boolean;       // 是否精选
  order: number;           // 排序权重
  createdAt: Date;
  updatedAt: Date;
}
```

### User (用户)

```typescript
interface User {
  _id: ObjectId;
  email: string;           // 邮箱
  passwordHash: string;    // 密码哈希
  name: string;            // 显示名称
  role: 'admin';           // 角色
  createdAt: Date;
  updatedAt: Date;
}
```

### ContactMessage (联系消息)

```typescript
interface ContactMessage {
  _id: ObjectId;
  name: string;            // 发送者姓名
  email: string;           // 发送者邮箱
  message: string;         // 消息内容
  read: boolean;           // 是否已读
  createdAt: Date;
}
```



## 正确性属性

*属性是一种应该在系统所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 项目卡片信息完整性
*对于任意*项目数据，渲染后的项目卡片应包含项目名称、描述、技术栈和链接信息
**验证: 需求 2.1**

### 属性 2: 文章列表信息完整性
*对于任意*文章数据，渲染后的文章卡片应包含标题、摘要、发布日期和标签
**验证: 需求 3.1**

### 属性 3: Markdown 渲染正确性
*对于任意*有效的 Markdown 内容，渲染函数应产生有效的 HTML 输出，且代码块应包含语法高亮标记
**验证: 需求 3.3**

### 属性 4: 文章搜索结果相关性
*对于任意*搜索关键词和文章列表，返回的搜索结果应只包含标题或内容中包含该关键词的文章
**验证: 需求 3.4**

### 属性 5: 表单验证正确性
*对于任意*表单输入，验证函数应正确识别：空字符串或纯空白字符串为无效，有效邮箱格式为有效，非空消息内容为有效
**验证: 需求 4.1**

### 属性 6: 认证凭据验证
*对于任意*登录凭据，验证函数应正确识别有效凭据（正确的邮箱和密码组合）并拒绝无效凭据
**验证: 需求 5.1**

### 属性 7: 内容持久化往返一致性
*对于任意*文章或项目数据，保存到数据库后再检索，应得到与原始数据等价的对象
**验证: 需求 5.3, 8.1**

### 属性 8: Meta 标签生成正确性
*对于任意*页面数据（标题、描述、图片），生成的 HTML 应包含正确的 title、description meta 标签和 Open Graph 标签
**验证: 需求 6.2**

### 属性 9: API 响应格式一致性
*对于任意*成功的 API 请求，响应应为 JSON 格式，包含 success: true 和 data 字段
**验证: 需求 7.1**

### 属性 10: API 错误响应格式一致性
*对于任意*失败的 API 请求，响应应为 JSON 格式，包含 success: false、error 字段和适当的 HTTP 状态码
**验证: 需求 7.2**

### 属性 11: 请求参数验证
*对于任意*API 请求参数，验证中间件应正确识别缺失的必填字段、类型错误的字段，并返回描述性错误信息
**验证: 需求 7.3**

### 属性 12: JWT Token 验证
*对于任意*JWT Token，验证中间件应正确识别：有效且未过期的 Token 为有效，过期或签名无效的 Token 为无效
**验证: 需求 7.4**

### 属性 13: 分页查询正确性
*对于任意*分页参数（page, limit），返回的结果数量应不超过 limit，且 skip 值应等于 (page - 1) * limit
**验证: 需求 8.2**

### 属性 14: JSON 序列化往返一致性
*对于任意*数据对象，JSON.stringify 后再 JSON.parse 应得到与原始对象深度相等的对象
**验证: 需求 8.4**

## 错误处理

### 前端错误处理

1. **网络错误**: 使用 React Query 的 retry 机制，最多重试 3 次，展示友好的错误提示
2. **API 错误**: 根据错误码展示对应的错误信息，提供重试按钮
3. **表单验证错误**: 实时验证，在字段下方展示错误信息
4. **404 错误**: 展示自定义 404 页面，提供返回首页链接

### 后端错误处理

1. **验证错误 (400)**: 返回字段级别的错误信息
2. **认证错误 (401)**: 返回 "未授权" 错误，前端跳转登录页
3. **权限错误 (403)**: 返回 "禁止访问" 错误
4. **资源不存在 (404)**: 返回 "资源不存在" 错误
5. **服务器错误 (500)**: 记录详细日志，返回通用错误信息

### 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // 错误码，如 "VALIDATION_ERROR"
    message: string;     // 用户友好的错误信息
    details?: object;    // 可选的详细错误信息
  };
}
```

## 测试策略

### 单元测试

使用 Jest 和 React Testing Library 进行单元测试：

- **组件测试**: 测试 UI 组件的渲染和交互
- **Hook 测试**: 测试自定义 Hook 的逻辑
- **工具函数测试**: 测试工具函数的输入输出
- **API 路由测试**: 测试后端 API 的请求处理

### 属性测试

使用 fast-check 进行属性测试，验证系统的正确性属性：

- 每个属性测试运行至少 100 次迭代
- 使用智能生成器约束输入空间
- 每个属性测试必须标注对应的正确性属性编号

**属性测试标注格式:**
```typescript
// **Feature: personal-website, Property 1: 项目卡片信息完整性**
// **Validates: Requirements 2.1**
```

### 集成测试

- **API 集成测试**: 使用 Supertest 测试完整的 API 流程
- **数据库集成测试**: 使用测试数据库验证数据持久化

### E2E 测试

使用 Playwright 进行端到端测试：

- 首页加载和导航
- 博客文章浏览
- 联系表单提交
- 管理后台登录和内容管理
