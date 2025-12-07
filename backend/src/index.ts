import dotenv from "dotenv";
// 最先加载环境变量，确保后续 import 可以读取
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./utils/db";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import postsRoutes from "./routes/posts.routes";
import projectsRoutes from "./routes/projects.routes";
import contactRoutes from "./routes/contact.routes";
import logger from "./utils/logger";

const requiredEnvVars = ["JWT_SECRET", "CORS_ORIGIN"];
// MONGODB_URI or MONGO_URL - check separately
const hasMongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (!hasMongoUri) {
  missingEnvVars.push("MONGODB_URI or MONGO_URL");
}

if (missingEnvVars.length > 0 && process.env.NODE_ENV === "production") {
  logger.error(
    `FATAL: Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin && process.env.NODE_ENV === "production") {
  throw new Error("CORS_ORIGIN must be set in production");
}

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(helmet());
app.use(cors({
  origin: corsOrigin || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.headers);
  mongoSanitize.sanitize(req.query as Record<string, unknown>);
  next();
});

// 健康检查路由 - Railway 默认检查根路径
app.get("/", (req, res) => {
  logger.info(`Health check received from ${req.ip}`);
  res.json({ success: true, data: { status: "ok", service: "zbw-life-api", timestamp: new Date().toISOString() } });
});

app.get("/api/health", (req, res) => {
  logger.info(`API health check received from ${req.ip}`);
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// API 路由
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
