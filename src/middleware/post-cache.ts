import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import { generateHashKey } from "../utils/hash-url";

export const postCacheMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // ✅ Only GET requests
    if (req.method !== "GET") {
        return next();
    }

    // ✅ Full URL
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // ✅ Hash key
    const hash = generateHashKey(fullUrl);

    // ✅ Store original res.json
    const originalJson = res.json.bind(res);

    // ✅ Override res.json
    res.json = (body: any) => {
        redisClient
            .set(hash, JSON.stringify(body), { EX: 60 })
            .then(() => console.log("✅ Cached:", hash))
            .catch((err) => console.log("❌ Redis Error:", err));

        return originalJson(body);
    };

    next();
};