import { Request, Response, NextFunction } from "express";
import redisClient from "../../config/redis";

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

        // Get cache policy
        const {
            skipCacheWrite = false,
            cacheKey,
            cacheStatus = "MISS",
        } = res.locals.cachePolicy || {};

        // Preserve X-Cache header (important)
        if (!res.getHeader("X-Cache")) {
            res.setHeader("X-Cache", cacheStatus);
        }

        // Skip cache write (no-store case)
        if (skipCacheWrite) {
            return res.status(statusCode).json(responseBody);
        }

        // Only cache GET requests
        if (req.method === "GET" && cacheKey) {
            try {
                await redisClient.set(
                    cacheKey,
                    JSON.stringify(responseBody),
                    "EX", // ✅ correct for ioredis
                    3600
                );

                console.log("✅ Cached:", cacheKey);
            } catch (err) {
                console.error("❌ Redis Save Error:", err);
            }
        }

        // FINAL RESPONSE
        return res.status(statusCode).json(responseBody);

    } catch (err) {
        next(err);
    }
};