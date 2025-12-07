import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MONGODB_URI or MONGO_URL is not defined in environment variables");
  }

  console.log("🔧 [DB] Connecting to MongoDB...");
  console.log(`🔧 [DB] URI prefix: ${mongoUri.substring(0, 30)}...`);

  const maxRetries = 5;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${maxRetries})...`);

      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
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
