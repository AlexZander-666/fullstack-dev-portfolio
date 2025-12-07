# AWS 部署指南 - zbw.life

本指南帮助你将项目部署到 AWS 免费层。

## 架构概览

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Route 53      │────▶│  AWS Amplify     │     │  MongoDB Atlas  │
│  (DNS/域名)     │     │  (Next.js前端)   │     │  (数据库)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        ▲
        │                        │ API调用                │
        ▼                        ▼                        │
┌─────────────────┐     ┌──────────────────┐              │
│   ACM           │     │ Elastic Beanstalk│──────────────┘
│  (SSL证书)      │     │  (Express后端)   │
└─────────────────┘     └──────────────────┘
```

## 步骤 1: MongoDB Atlas 设置

### 1.1 创建账户和集群
1. 访问 https://www.mongodb.com/atlas
2. 注册/登录账户
3. 创建新项目 (如: `zbw-life`)
4. 点击 "Build a Database" → 选择 **M0 Free Tier**
5. 选择云服务商和区域 (推荐 AWS us-east-1)
6. 集群名称: `Cluster0`

### 1.2 创建数据库用户
1. Security → Database Access → Add New Database User
2. 认证方式: Password
3. 用户名: `zbw_admin` (记住这个)
4. 密码: 生成强密码 (记住这个)
5. 权限: Read and write to any database

### 1.3 配置网络访问
1. Security → Network Access → Add IP Address
2. **测试阶段**: 点击 "Allow Access from Anywhere" (0.0.0.0/0)
3. **生产环境**: 后续添加 Elastic Beanstalk 的 IP

### 1.4 获取连接字符串
1. Database → Connect → Drivers
2. 复制连接字符串，格式如:
```
mongodb+srv://zbw_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
3. 替换 `<password>` 为实际密码
4. 在 `?` 前添加数据库名: `personal-website`

最终格式:
```
mongodb+srv://zbw_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/personal-website?retryWrites=true&w=majority
```

---

## 步骤 2: Elastic Beanstalk 部署后端

### 2.1 创建部署包
在 `backend` 目录运行:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-eb-bundle.ps1
```

这会生成 `eb-bundle.zip` 文件。

### 2.2 创建 Elastic Beanstalk 应用
1. 登录 AWS Console → Elastic Beanstalk
2. Create Application
   - Application name: `zbw-life-backend`
3. Create Environment
   - Environment tier: Web server environment
   - Environment name: `zbw-life-backend-prod`
   - Platform: Node.js 20
   - Application code: Upload your code → 选择 `eb-bundle.zip`

### 2.3 配置环境变量
在 Configuration → Software → Environment properties 添加:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://...` (步骤1获取的) |
| `MONGODB_SEEDLIST` | (可选) DNS 有问题时，提供 IP 或 host:port 逗号分隔 |
| `MONGODB_REPLICA_SET` | (可选) 自定义副本集名称，默认 `atlas-<subdomain>-shard-0` |
| `JWT_SECRET` | `<64位随机字符串>` |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://www.zbw.life` |

生成 JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 验证部署
部署完成后，访问 EB 提供的域名:
```
http://zbw-life-backend-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com/api/health
```

应返回:
```json
{"success":true,"data":{"status":"ok","timestamp":"..."}}
```

**记录这个域名**，下一步需要用到。

> EB 包中包含 `.platform` 目录：预安装 Node.js 20.x、部署后自动健康检查、Nginx 配置修复与探测阻断。

---

## 步骤 3: AWS Amplify 部署前端

### 3.1 推送代码到 GitHub
确保 `frontend` 目录已推送到 GitHub 仓库。

### 3.2 连接 Amplify
1. AWS Console → Amplify → Create new app
2. 选择 GitHub → 授权
3. 选择仓库和分支
4. **重要**: 设置 App root directory 为 `frontend`

### 3.3 配置构建设置
Amplify 会自动检测 Next.js，确认 `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3.4 添加环境变量
在 Amplify Console → App settings → Environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.zbw.life/api` 或 EB域名 |

**注意**: 如果还没配置自定义域名，先用 EB 的完整域名:
```
http://zbw-life-backend-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com/api
```

### 3.5 触发部署
保存后 Amplify 会自动构建部署。

---

## 步骤 4: Route 53 域名配置

### 4.1 创建托管区域
1. Route 53 → Hosted zones → Create hosted zone
2. Domain name: `zbw.life`
3. 记录 NS 记录，更新到你的域名注册商

### 4.2 配置 DNS 记录

**前端 (www.zbw.life)**:
- 在 Amplify Console → Domain management → Add domain
- 输入 `zbw.life`，Amplify 会自动创建 Route 53 记录

**后端 (api.zbw.life)**:
- Route 53 → Create record
- Record name: `api`
- Record type: CNAME
- Value: EB 域名 (如 `zbw-life-backend-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com`)

---

## 步骤 5: HTTPS 证书 (ACM)

### 5.1 申请证书
1. AWS Certificate Manager (必须在 **us-east-1** 区域)
2. Request certificate → Request a public certificate
3. 域名: `*.zbw.life` 和 `zbw.life`
4. 验证方式: DNS validation
5. 点击 "Create records in Route 53" 自动添加验证记录

### 5.2 配置 HTTPS

**Amplify**: 自动处理，无需额外配置

**Elastic Beanstalk**:
1. Configuration → Load balancer
2. Add listener: Port 443, Protocol HTTPS
3. SSL certificate: 选择 ACM 证书
4. 可选: 添加 HTTP → HTTPS 重定向

---

## 步骤 6: 更新环境变量

部署完成后，更新以下配置:

**Elastic Beanstalk**:
```
CORS_ORIGIN=https://www.zbw.life
```

**Amplify**:
```
NEXT_PUBLIC_API_URL=https://api.zbw.life/api
```

重新部署两边使配置生效。

---

## 验证清单

- [ ] MongoDB Atlas 集群运行中
- [ ] EB 健康检查通过: `https://api.zbw.life/api/health`
- [ ] 前端可访问: `https://www.zbw.life`
- [ ] API 调用正常 (检查浏览器 Network 面板)
- [ ] CORS 无报错
- [ ] HTTPS 证书有效

---

## 常见问题

### Q: EB 部署失败
查看 Logs → Request Logs → Last 100 Lines，常见原因:
- `package.json` 缺少 `start` 脚本
- 环境变量未设置
- MongoDB 连接失败 (检查 Network Access)

### Q: CORS 错误
确保:
1. EB 的 `CORS_ORIGIN` 与前端域名完全匹配
2. 包含 `https://` 前缀
3. 没有尾部斜杠

### Q: MongoDB 连接超时
1. 检查 Atlas Network Access 是否包含 EB IP
2. 确认连接字符串格式正确
3. 检查用户名密码是否正确

---

## 成本估算 (免费层)

| 服务 | 免费额度 |
|------|----------|
| Elastic Beanstalk | t2.micro 750小时/月 |
| Amplify | 构建 1000分钟/月, 托管 5GB |
| MongoDB Atlas | M0 512MB 存储 |
| Route 53 | $0.50/托管区域/月 |
| ACM | 免费 |

**预计月费**: ~$0.50 (仅 Route 53)
