import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("❌ REDIS_URL is not defined in .env");
}

// ✅ ioredis connection (BullMQ compatible)
const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // important for BullMQ
});

// ✅ Connection success
redisConnection.on("connect", () => {
    console.log("✅ Redis Connected (ioredis)");
});

// ❌ Error handling
redisConnection.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

export default redisConnection;