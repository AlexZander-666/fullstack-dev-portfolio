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
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`,
      {
        headers: { Accept: "application/dns-json" },
      }
    );
    const data = (await response.json()) as DnsResponse;
    if (data.Answer && data.Answer.length > 0) {
      const record = data.Answer.find((a) => a.type === 1);
      if (record) {
        console.log(`✅ DoH resolved ${hostname} to ${record.data}`);
        return record.data;
      }
    }
  } catch (error) {
    console.error(`❌ DoH resolution failed for ${hostname}:`, error);
  }
  return null;
};

/**
 * 解析 SRV 记录获取 MongoDB 主机列表
 */
const resolveSrvWithDoH = async (srvHostname: string): Promise<string[]> => {
  try {
    const srvName = `_mongodb._tcp.${srvHostname}`;
    console.log(`🔍 Resolving SRV record: ${srvName}`);
    
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${srvName}&type=SRV`,
      { headers: { Accept: "application/dns-json" } }
    );
    const data = (await response.json()) as { Answer?: Array<{ type: number; data: string }> };
    
    if (data.Answer && data.Answer.length > 0) {
      const hosts: string[] = [];
      for (const record of data.Answer) {
        if (record.type === 33) { // SRV record
          // SRV data format: "priority weight port target"
          const parts = record.data.split(" ");
          if (parts.length >= 4) {
            const target = parts[3].replace(/\.$/, ""); // Remove trailing dot
            const port = parts[2];
            hosts.push(`${target}:${port}`);
            console.log(`✅ SRV found: ${target}:${port}`);
          }
        }
      }
      return hosts;
    }
  } catch (error) {
    console.error(`❌ SRV resolution failed:`, error);
  }
  return [];
};

/**
 * 将 mongodb+srv:// 连接字符串转换为标准格式，使用 DoH 解析
 */
const resolveMongoUri = async (uri: string): Promise<string> => {
  console.log("🔧 Starting MongoDB URI resolution...");
  
  // 检查是否是 SRV 格式
  if (!uri.startsWith("mongodb+srv://")) {
    console.log("⚠️ Not an SRV URI, skipping DoH resolution");
    return uri;
  }

  try {
    // 解析 URI: mongodb+srv://user:pass@host/db?options
    const srvMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
    if (!srvMatch) {
      console.log("⚠️ Could not parse SRV URI format");
      return uri;
    }

    const [, user, pass, srvHost, dbAndOptions] = srvMatch;
    console.log(`📍 SRV host: ${srvHost}`);

    // 使用 DoH 解析 SRV 记录
    const hosts = await resolveSrvWithDoH(srvHost);
    
    if (hosts.length === 0) {
      console.log("⚠️ No SRV records found, trying direct host resolution...");
      // 尝试直接解析主机名
      const ip = await resolveWithDoH(srvHost);
      if (ip) {
        const newUri = `mongodb://${user}:${pass}@${ip}:27017/${dbAndOptions}&directConnection=true&tls=true&tlsAllowInvalidHostnames=true`;
        console.log("✅ Using direct IP connection");
        return newUri;
      }
      return uri;
    }

    // 解析每个主机的 IP 地址
    const resolvedHosts: string[] = [];
    for (const hostPort of hosts) {
      const [hostname, port] = hostPort.split(":");
      const ip = await resolveWithDoH(hostname);
      if (ip) {
        resolvedHosts.push(`${ip}:${port}`);
      } else {
        resolvedHosts.push(hostPort); // 保留原始主机名
      }
    }

    // 构建标准 MongoDB URI
    const hostList = resolvedHosts.join(",");
    
    // 从原始 options 中提取 replicaSet 名称（如果有的话）
    let options = dbAndOptions.includes("?") ? dbAndOptions.split("?")[1] : "";
    const dbName = dbAndOptions.split("?")[0];
    
    // 添加必要的选项
    const extraOptions = "tls=true&tlsAllowInvalidHostnames=true&authSource=admin";
    options = options ? `${options}&${extraOptions}` : extraOptions;
    
    const newUri = `mongodb://${user}:${pass}@${hostList}/${dbName}?${options}`;
    console.log(`✅ Resolved URI with ${resolvedHosts.length} hosts`);
    
    return newUri;
  } catch (error) {
    console.error("❌ URI resolution error:", error);
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
