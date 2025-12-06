# Full Stack Developer Portfolio

个人全栈开发者网站，前端由 Next.js 负责界面展示与交互，后端由 Express + TypeScript 提供 API 支撑，MongoDB 负责数据存储，适合展示技能、项目、博客与联系方式。

## 项目结构
- `frontend/`：基于 Next.js 13 App Router 的客户端，包含页面、组件与静态资源。
- `backend/`：Express + TypeScript API，组织在 controllers、routes、schemas 等目录，提供身份验证、项目、文章与联系方式接口。

## 环境准备
1. 本地安装 [Node.js 18+](https://nodejs.org/) 与 npm。
2. 复制配置文件：
   - `backend/.env.example` → `backend/.env`
   - `frontend/.env.example` → `frontend/.env.local`
3. 填写以下关键环境变量：
   - `MONGODB_URI`：MongoDB 连接串。
   - `JWT_SECRET`、`JWT_EXPIRES_IN`：用户认证密钥与过期时间。
   - `CORS_ORIGIN`：允许跨域的前端地址（如 `http://localhost:3000`）。
   - `NEXT_PUBLIC_API_URL`：前端调用的 API 基础地址（开发使用 `http://localhost:5000/api`）。

## 本地运行
1. 安装依赖
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. 启动开发环境
   - 后端（自动重启）：`npm run dev`
   - 前端：`npm run dev`
3. 分别访问 `http://localhost:5000/api/health` 与 `http://localhost:3000` 确认服务上线。

## 构建与生产
- 后端：`npm run build` 编译到 `dist/`，`npm run start` 启动生产包。
- 前端：`npm run build` → `npm run start`（或部署到 Vercel/Amplify）。

## 其他说明
- `ImportantData/` 目录包含敏感文件，不应提交。
- 编译输出、依赖与本地配置都已经通过 `.gitignore` 屏蔽。
