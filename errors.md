## 2025-12-06

- 尝试 `cd backend && npm run start`，已先导出 JWT_SECRET/CORS_ORIGIN/MONGODB_URI/SMTP 等环境变量；启动过程中多次重试连接 MongoDB (`mongodb://localhost:27017/alexcode`) 失败，报错 `connect ECONNREFUSED 127.0.0.1:27017`，命令超时退出。需要本地/可用的 MongoDB 服务后再验证启动。
- 更新 .env 为 Atlas 连接串后再次 `npm run start`，DoH 解析失败并报 `getaddrinfo ENOTFOUND cluster0-shard-00-00.68pjrj6.mongodb.net`，提示 IP 未白名单或 DNS 解析失败，持续重试后超时退出。需要先保证本机能解析/访问 Atlas 域名（或使用稳定 DNS/VPN），再重试启动。
