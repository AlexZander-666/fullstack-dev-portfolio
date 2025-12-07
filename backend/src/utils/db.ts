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
 * 将 mongodb+srv:// 或标准连接字符串中的主机名替换为 IP 地址
 */
const resolveMongoUri = async (uri: string): Promise<string> => {
  // 匹配所有 MongoDB Atlas 主机名
  const hostRegex = /(cluster0-shard-00-\d{2}\.6bpjrj6\.mongodb\.net)/g;
  const matches = uri.match(hostRegex);
  
  if (!matches) {
    console.log("⚠️ No MongoDB hostnames found to resolve");
    return uri;
  }

  const uniqueHosts = [...new Set(matches)];
  let resolvedUri = uri;

  console.log(`🔍 Resolving ${uniqueHosts.length} MongoDB hosts via DoH...`);

  for (const hostname of uniqueHosts) {
    const ip = await resolveWithDoH(hostname);
    if (ip) {
      resolvedUri = resolvedUri.split(hostname).join(ip);
    }
  }

  // 如果使用 IP 地址，需要允许无效的主机名（因为 SSL 证书是颁发给域名的）
  if (resolvedUri !== uri && !resolvedUri.includes("tlsAllowInvalidHostnames")) {
    const separator = resolvedUri.includes("?") ? "&" : "?";
    resolvedUri += `${separator}tlsAllowInvalidHostnames=true`;
  }

  return resolvedUri;
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
