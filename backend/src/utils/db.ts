import mongoose from "mongoose";

/**
 * 将 mongodb+srv:// 连接字符串转换为标准 mongodb:// 格式
 * 这样可以绕过 SRV DNS 查询问题
 */
const convertSrvToStandard = (srvUri: string): string => {
  // 如果不是 SRV 格式，直接返回
  if (!srvUri.startsWith("mongodb+srv://")) {
    return srvUri;
  }

  // 解析 SRV URI: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/dbname?options
  const match = srvUri.match(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@([^.]+)\.([^.]+)\.mongodb\.net\/([^?]*)\??(.*)/
  );

  if (!match) {
    console.log("⚠️ Could not parse SRV URI, using original");
    return srvUri;
  }

  const [, user, pass, cluster, subdomain, dbName, options] = match;

  // 构建标准连接字符串，使用已知的 shard 地址
  const shards = [
    `${cluster}-shard-00-00.${subdomain}.mongodb.net:27017`,
    `${cluster}-shard-00-01.${subdomain}.mongodb.net:27017`,
    `${cluster}-shard-00-02.${subdomain}.mongodb.net:27017`,
  ];

  // 构建标准 URI
  const standardUri = `mongodb://${user}:${pass}@${shards.join(",")}/${dbName}?ssl=true&replicaSet=atlas-${subdomain}-shard-0&authSource=admin&${options}`;

  console.log("🔄 Converted SRV to standard connection string");
  return standardUri;
};

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // 转换为标准连接字符串
  const connectionUri = convertSrvToStandard(mongoUri);

  // 最多重试 5 次
  const maxRetries = 5;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${maxRetries})...`);

      const conn = await mongoose.connect(connectionUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Connection attempt ${attempt} failed:`, (error as Error).message);

      if (attempt < maxRetries) {
        const waitTime = attempt * 2000;
        console.log(`⏳ Waiting ${waitTime / 1000} seconds before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error("❌ All MongoDB connection attempts failed");
  throw lastError;
};

// 监听连接事件
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// 优雅关闭连接
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
