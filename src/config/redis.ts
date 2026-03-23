import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("❌ REDIS_URL is not defined in .env");
}

const redisClient = createClient({
    url: redisUrl,
});


// ❌ Error handling
redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

// ✅ Proper async connect
(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connected");
    } catch (err) {
        console.error("❌ Redis Connection Failed:", err);
    }
})();

export default redisClient;