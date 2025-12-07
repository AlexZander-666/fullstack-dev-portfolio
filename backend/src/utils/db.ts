import mongoose from "mongoose";

interface DnsAnswer {
  type: number;
  data: string;
}

interface DnsResponse {
  Answer?: DnsAnswer[];
}

/**
 * 使用 DNS-over-HTTPS (Cloudflare) 解析域名
 */
const resolveWithDoH = async (hostname: string): Promise<string | null> => {
  try {
    console.log(`🔍 DoH resolving: ${hostname}`);
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`,
      {
        headers: { Accept: "application/dns-json" },
      }
    );
    const data = (await response.json()) as DnsResponse;
    console.log(`📦 DoH response for ${hostname}:`, JSON.stringify(data));
    if (data.Answer && data.Answer.length > 0) {
      const record = data.Answer.find((a) => a.type === 1);
      if (record) {
        console.log(`✅ DoH resolved ${hostname} -> ${record.data}`);
        return record.data;
      }
    }
    console.log(`⚠️ No A record found for ${hostname}`);
  } catch (error) {
    console.error(`❌ DoH resolution failed for ${hostname}:`, error);
  }
  return null;
};

/**
 * 将 mongodb+srv:// 连接字符串转换为标准格式，使用 DoH 解析
 */
const resolveMongoUri = async (uri: string): Promise<string> => {
  console.log("🔧 [DB] Starting MongoDB URI resolution...");
  console.log(`🔧 [DB] Original URI prefix: ${uri.substring(0, 30)}...`);
  
  // 检查是否是 SRV 格式
  if (!uri.startsWith("mongodb+srv://")) {
    console.log("⚠️ [DB] Not an SRV URI, using as-is");
    return uri;
  }

  try {
    // 解析 URI: mongodb+srv://user:pass@host/db?options
    const srvMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
    if (!srvMatch) {
      console.log("⚠️ [DB] Could not parse SRV URI format");
      return uri;
    }

    const [, user, pass, srvHost, dbAndOptions] = srvMatch;
    console.log(`📍 [DB] SRV host: ${srvHost}`);
    console.log(`📍 [DB] Database: ${dbAndOptions.split("?")[0]}`);

    // 构建 shard 主机名列表 (MongoDB Atlas 标准格式)
    const shardHosts = [
      `${srvHost.replace("cluster0.", "cluster0-shard-00-00.")}`,
      `${srvHost.replace("cluster0.", "cluster0-shard-00-01.")}`,
      `${srvHost.replace("cluster0.", "cluster0-shard-00-02.")}`,
    ];
    
    console.log(`🔍 [DB] Will resolve these hosts:`, shardHosts);

    // 解析每个主机的 IP 地址
    const resolvedHosts: string[] = [];
    for (const hostname of shardHosts) {
      const ip = await resolveWithDoH(hostname);
      if (ip) {
        resolvedHosts.push(`${ip}:27017`);
      }
    }

    if (resolvedHosts.length === 0) {
      console.log("❌ [DB] Failed to resolve any hosts, falling back to original URI");
      return uri;
    }

    // 构建标准 MongoDB URI
    const hostList = resolvedHosts.join(",");
    const dbName = dbAndOptions.split("?")[0];
    
    // 添加必要的选项
    const options = "tls=true&tlsAllowInvalidHostnames=true&authSource=admin&replicaSet=atlas-6bpjrj-shard-0";
    
    const newUri = `mongodb://${user}:${pass}@${hostList}/${dbName}?${options}`;
    console.log(`✅ [DB] Resolved URI with ${resolvedHosts.length} hosts`);
    console.log(`✅ [DB] Host list: ${hostList}`);
    
    return newUri;
  } catch (error) {
    console.error("❌ [DB] URI resolution error:", error);
    return uri;
  }
};

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // 使用 DoH 解析 MongoDB 主机名
  const resolvedUri = await resolveMongoUri(mongoUri);

  const maxRetries = 5;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${maxRetries})...`);

      const conn = await mongoose.connect(resolvedUri, {
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

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
