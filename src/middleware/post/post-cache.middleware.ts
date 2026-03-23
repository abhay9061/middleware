import { Request, Response, NextFunction } from "express";
import redisClient from "../../config/redis";
import { generateHashKey } from "../../utils/hash-url";

export const postCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const responseBody = res.locals.responseBody;
        const statusCode = res.locals.statusCode || 200;

        if (!responseBody) {
            return next();
        }

        // ✅ Only cache GET requests
        if (req.method === "GET") {
            const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

            const userId = (req as any).user?.id || "guest";

            // ✅ Unique key (URL + user)
            const hashKey = generateHashKey(`${fullUrl}-${userId}`);

            try {
                await redisClient.set(hashKey, JSON.stringify(responseBody), {
                    EX: 3600, // 1 hour
                });

                console.log("✅ Cached:", hashKey);
            } catch (err) {
                console.error("❌ Redis Save Error:", err);
            }
        }

        // ✅ FINAL RESPONSE SEND
        return res.status(statusCode).json(responseBody);

    } catch (err) {
        next(err);
    }
};