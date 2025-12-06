# Full Stack Developer Portfolio

个人全栈开发者网站，前端由 Next.js 负责界面展示与交互，后端由 Express + TypeScript 提供 API 支撑，MongoDB 负责数据存储，适合展示技能、项目、博客与联系方式。

## 文档速览
- [`docs/README.md`](docs/README.md)：文档入口，概览所有手册。
- [`docs/architecture.md`](docs/architecture.md)：系统结构与模块关系。
- [`docs/development.md`](docs/development.md)：环境变量、脚本与本地开发流程。
- [`docs/deployment/aws.md`](docs/deployment/aws.md)：Elastic Beanstalk + Amplify 部署指南。

## 项目结构
```
.
├── backend/      # Express + TypeScript API
├── frontend/     # Next.js 13 App Router 客户端
├── docs/         # 架构、开发和部署文档
└── .github/      # GitHub Actions 工作流
```

重要目录说明：
- `frontend/`：页面位于 `src/app`，组件在 `src/components`，Tailwind v4 样式集中在 `src/app/globals.css`。
- `backend/`：控制器、路由、schema 与模型彼此分离，`src/utils/db.ts` 负责 MongoDB 链接与重试机制。
- `docs/`：把部署指南等长文档集中管理，保持仓库根目录干净。

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
   npm install                # 安装根目录脚本依赖
   (cd backend && npm install)
   (cd frontend && npm install)
   ```
2. 启动开发环境
   ```bash
   npm run dev          # 并行启动前后端
   npm run dev:backend  # 仅运行后端
   npm run dev:frontend # 仅运行前端
   ```
3. 分别访问 `http://localhost:5000/api/health` 与 `http://localhost:3000` 确认服务上线。

## 构建与生产
- 后端：`(cd backend && npm run build)` 编译到 `dist/`，`npm run start` 启动生产包。
- 前端：`(cd frontend && npm run build)` → `npm run start`（或部署到 Vercel/Amplify）。
- 根目录命令：`npm run build` 会串行构建前后端，`npm run lint` 同步运行 API 的 `tsc --noEmit` 与前端 `next lint`。

## 其他说明
- `ImportantData/` 目录包含敏感文件，不应提交。
- 编译输出、依赖与本地配置都已经通过 `.gitignore` 屏蔽。
